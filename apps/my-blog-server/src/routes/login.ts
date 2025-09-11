import express, { Router, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { verifyToken, verifyRefreshToken } from "../middlewares"
import sendVerificationEmail from "../utils/mail"
import { db } from '../db/mongodb'
import { ObjectId } from "mongodb"
const router: Router = express.Router()
// 验证码缓存
let verificationCodes = new Map()
// 秘钥与配置
const accessSecret = 'my-blog'
const refreshSecret = 'my-blog-refresh'
const accessOptions = {
    expiresIn: 10 * 60
}
const refreshOptions = {
    expiresIn: 7 * 24 * 60 * 60
}
// 登录接口
router.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
        const result = await db.collection('user').findOne({ username })
        if (!result) {
            const str = {
                code: 400,
                message: '用户不存在',
            }
            res.send(str)
            return
        }
        if (result.password === password) {
            const payload = {
                uid: result._id,
                username: username,
            }
            const str = {
                code: 200,
                message: '登录成功',
                data: {
                    ...result,
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
    } catch (err) {
        res.send({
            code: 500,
            message: '服务器错误',
            error: err
        })
    }
})
router.get('/checkLogin', verifyToken, (req: Request, res: Response) => {
    const str = {
        code: 200,
        message: '已登录'
    }
    res.send(str)
})
// 发送验证码
router.post('/sendVerificationCode', async (req: Request, res: Response) => {
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
router.post('/register', async (req: Request, res: Response) => {
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
    try {
        const result = await db.collection('user').findOne({ username })
        if (result) {
            const str = {
                code: 400,
                message: '用户已存在',
            }
            res.send(str)
            return
        }
        const data = await db.collection('user').insertOne({ username, password, email })
        res.send({
            code: 200,
            message: '注册成功',
            data,
        })
    } catch (err) {
        res.send({
            code: 500,
            message: '服务器错误',
            error: err
        })
    }
})
// 延迟token有效期
router.post('/refresh', verifyRefreshToken, async (req: any, res: Response) => {
    const token = req.token
    let payload = jwt.decode(token) as any
    try {
        // 如果前面校验通过，再查询数据库
        const result = await db.collection('user').findOne({ _id: new ObjectId(payload?.uid as string) })
        const newPayload = {
            uid: payload.uid,
            username: payload.username,
        }

        const accessToken = jwt.sign(newPayload, accessSecret, accessOptions)

        const responseData = {
            code: 200,
            message: '刷新成功',
            data: {
                ...result,
                password: '', // 清空密码
            },
        }

        res.header('Authorization', `Bearer ${accessToken}`).send(responseData) // ✅ 只发一次响应
    } catch (err) {
        res.send({
            code: 500,
            message: '服务器错误',
            error: err
        })
    }
})
export default router
