import express, { Router, Request, Response } from "express"
import multer from "multer"
import { verifyToken } from "../middlewares"
import { db } from '../db/mongodb'
import { ObjectId } from "mongodb"
const router: Router = express.Router()

// multer 内存存储
const storage = multer.memoryStorage()
const upload = multer({ storage })
// 修改头像
router.post('/changeAvatar', verifyToken, upload.single('avatar'), async (req: any, res: Response) => {
    const uid = req.body.uid // 获取文本字段 uid
    const avatarFile = req.file // 获取上传的文件
    res.json({
        code: 500,
        message: '服务暂不可用',
    })
})
// 修改用户名
router.post('/changeUsername', verifyToken, async (req: Request, res: Response) => {
    const { uid, username } = req.body

    try {
        // 先检查用户名是否存在
        const existingUser = await db.collection('user').findOne({ username })
        if (existingUser) {
            return res.json({ code: 400, message: '用户名已存在' })
        }

        // 更新用户名
        const result = await db.collection('user').updateOne(
            { _id: new ObjectId(uid) },
            { $set: { username } }
        )

        if (result.modifiedCount === 1) {
            return res.json({ code: 200, message: '更新成功' })
        } else {
            return res.json({ code: 400, message: '更新失败或未修改' })
        }
    } catch (err: any) {
        console.error(err.message)
        return res.json({ code: 500, message: '服务器错误' })
    }
})
// 修改邮箱
router.post('/changeEmail', verifyToken, async (req: Request, res: Response) => {
    const { uid, email } = req.body
    try {
        const result = await db.collection('user').updateOne(
            { _id: new ObjectId(uid) },
            { $set: { email } }
        )

        if (result.modifiedCount === 1) {
            res.send({ code: 200, message: '更新成功' })
        } else {
            res.send({ code: 400, message: '更新失败或未修改' })
        }
    } catch (err: any) {
        console.log(err.message)
        res.send({ code: 400, message: '更新失败' })
    }
})
// 修改地址
router.post('/changeAddress', verifyToken, async (req: Request, res: Response) => {
    const { uid, address } = req.body
    try {
        const result = await db.collection('user').updateOne(
            { _id: new ObjectId(uid) }, // 转 ObjectId
            { $set: { address } }       // 更新字段
        )

        if (result.modifiedCount === 1) {
            res.send({ code: 200, message: '更新成功' })
        } else {
            res.send({ code: 400, message: '更新失败或未修改' })
        }
    } catch (err: any) {
        console.log(err.message)
        res.send({ code: 400, message: '更新失败' })
    }
})
export default router
