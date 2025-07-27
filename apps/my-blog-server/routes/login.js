const express = require('express')
const router = express.Router()
const { pool } = require('../utils/index')
const jwt = require('jsonwebtoken')
const { verifyToken, verifyRefreshToken } = require('../middlewares/index')
const sendVerificationEmail = require('../utils/mail')
// 验证码缓存
let verificationCodes = new Map()
// MySQL 查询
const getUserByUsername = 'select * from user where username = ?'
const getUserByUID = 'select * from user where uid = ?'
const register = 'insert into user (username,password,email,avatar) values (?,?,?,?)'
// 秘钥与配置
const accessSecret = 'my-blog'
const refreshSecret = 'my-blog-refresh'
const accessOptions = {
    expiresIn: '10m'
}
const refreshOptions = {
    expiresIn: '7d'
}
// 登录接口
router.post('/', (req, res) => {
    const { username, password } = req.body
    pool.query(getUserByUsername, [username], (err, result) => {
        if (err) {
            const str = {
                code: 400,
                message: '登录失败',
            }
            res.send(str)
            return console.log(err.message)
        }
        if (result.length === 0) {
            const str = {
                code: 400,
                message: '用户不存在',
            }
            res.send(str)
            return
        }
        if (result[0].password === password) {
            const payload = {
                uid: result[0].uid,
                username: username,
            }
            const str = {
                code: 200,
                message: '登录成功',
                data: {
                    ...result[0],
                    password: '',
                }
            }
            const accessToken = jwt.sign(payload, accessSecret, accessOptions)
            const refreshToken = jwt.sign(payload, refreshSecret, refreshOptions)
            res.header('Authorization', `Bearer ${accessToken}`).header('refresh_token', refreshToken).send(str)
        } else {
            const str = {
                code: 400,
                message: '密码错误',
            }
            res.send(str)
        }
    })

})
router.get('/checkLogin', verifyToken, (req, res) => {
    const str = {
        code: 200,
        message: '已登录'
    }
    res.send(str)
})
// 发送验证码
router.post('/sendVerificationCode', async (req, res) => {
    const { email } = req.body
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    try {
        await sendVerificationEmail(email, code)
        verificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 })
        res.json({ message: '验证码已发送', code: 200 })
    } catch (error) {
        res.status(500).json({ message: '发送失败', error, code: 500 })
    }
})
// 注册账号
router.post('/register', async (req, res) => {
    const { username, password, email, code } = req.body
    if (!verificationCodes.has(email)) {
        return res.json({ message: '验证码已过期', code: 400 })
    }
    const verificationCode = verificationCodes.get(email)
    if (Date.now() - verificationCode.expires > 10 * 60 * 1000) {
        verificationCodes.delete(email)
        return res.json({ message: '验证码已过期', code: 400 })
    }
    if (verificationCode.code !== code) {
        return res.json({ message: '验证码错误', code: 400 })
    }
    pool.query(getUserByUsername, [username], (err, result) => {
        if (err) {
            return res.json({ message: '服务器错误', code: 500 })
        }
        if (result.length > 0) {
            return res.json({ message: '用户名已存在', code: 400 })
        } else {
            pool.query(register, [username, password, email, 'http://8.137.77.95:3100/resource/blog/vue3-background.jpg'], (error, result2) => {
                if (error) {
                    return res.json({ message: '服务器错误' })
                }
                return res.json({ message: '注册成功', code: 200 })
            })
        }
    })
})
// 延迟token有效期
router.post('/refresh', verifyRefreshToken, async (req, res) => {
    const token = req.token
    let payload = jwt.decode(token)
    // 如果前面校验通过，再查询数据库
    pool.query(getUserByUID, [payload.uid], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ message: '刷新失败' }) // ❗加 return
        }

        const newPayload = {
            uid: payload.uid,
            username: payload.username,
        };

        const accessToken = jwt.sign(newPayload, accessSecret, accessOptions);

        const responseData = {
            code: 200,
            message: '刷新成功',
            data: {
                ...result[0],
                password: '', // 清空密码
            },
        };

        res.header('Authorization', `Bearer ${accessToken}`).send(responseData) // ✅ 只发一次响应
    });
})
module.exports = router
