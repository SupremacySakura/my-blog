const express = require('express')
const router = express.Router()
const { pool } = require('../utils/index')
const multer = require('multer')
const yxzqUtils = require('@yxzq-web-resource-tools/yxzq-utils-node')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const { verifyToken } = require('../middlewares/index')
// MySQL 查询
const updateUserAvatar = 'UPDATE user SET avatar = ? WHERE uid = ?'
const updateUsername = 'UPDATE user SET username = ? WHERE uid = ?'
const checkUsername = 'SELECT * FROM user WHERE username = ?'
const updateEmail = 'UPDATE user SET email = ? WHERE uid = ?'
const updateAddress = 'UPDATE user SET address = ? WHERE uid = ?'
// 修改头像
router.post('/changeAvatar', verifyToken, upload.single('avatar'), async (req, res) => {
    const uid = req.body.uid // 获取文本字段 uid
    const avatarFile = req.file // 获取上传的文件
    res.json({
        code: 500,
        message: '服务暂不可用',
    })
})
// 修改用户名
router.post('/changeUsername', verifyToken, async (req, res) => {
    const { uid, username } = req.body

    pool.query(checkUsername, username, (err, result) => {
        if (err) {
            console.log(err.message)
            return res.status(400).json({ code: 400, message: '更新失败' })
        }

        if (result[0]) {
            return res.status(400).json({ code: 400, message: '用户名已存在' })
        }

        // 用户名不存在，可以更新
        pool.query(updateUsername, [username, uid], (err, result) => {
            if (err) {
                console.log(err.message);
                return res.status(400).json({ code: 400, message: '更新失败' })
            }

            return res.json({ code: 200, message: '更新成功' })
        })
    })
})
// 修改邮箱
router.post('/changeEmail', verifyToken, async (req, res) => {
    const { uid, email } = req.body
    pool.query(updateEmail, [email, uid], (err, result) => {
        if (err) {
            const str = {
                code: 400,
                message: '更新失败',
            }
            res.send(str)
            return console.log(err.message)
        }
        const str = {
            code: 200,
            message: '更新成功'
        }
        res.send(str)
    })
})
// 修改地址
router.post('/changeAddress', verifyToken, async (req, res) => {
    const { uid, address } = req.body
    pool.query(updateAddress, [address, uid], (err, result) => {
        if (err) {
            const str = {
                code: 400,
                message: '更新失败',
            }
            res.send(str)
            return console.log(err.message)
        }
        const str = {
            code: 200,
            message: '更新成功'
        }
        res.send(str)
    })
})
module.exports = router
