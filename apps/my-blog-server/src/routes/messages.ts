import express, { Router, Request, Response } from "express"
import { verifyToken } from "../middlewares"
import { db } from '../db/mongodb'
import { Db } from "mongodb"
const router: Router = express.Router()
const getMessages = async (db: Db, page = 1, pageSize = 10) => {
  const skip = (page - 1) * pageSize

  return db.collection("message")
    .aggregate([
      // 如果 user_id 是字符串，先转 ObjectId
      {
        $addFields: {
          user_id: {
            $convert: {
              input: "$user_id",
              to: "objectId",
              onError: "$user_id",
              onNull: "$user_id"
            }
          }
        }
      },
      // 联合 user 表
      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      // 展开 user
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      // 按 _id 倒序
      { $sort: { _id: -1 } },
      // 分页
      { $skip: skip },
      { $limit: pageSize }
    ])
    .toArray()
}
// 查询留言接口
router.get('/', async (req: Request, res: Response) => {
  const page = req.query.page as any
  try {
    const data = await getMessages(db, page, 5)
    res.send({
      code: 200,
      message: '查询留言成功',
      data
    })
  } catch (err) {
    const str = {
      code: 500,
      message: '查询留言失败',
      error: err
    }
    res.send(str)
  }
})
// 发表留言接口
router.post('/post', verifyToken, async (req: Request, res: Response) => {
  try {
    const data = await db.collection('message').insertOne(req.body)
    res.send({
      code: 200,
      message: '发布留言成功',
      data: data
    })
  } catch (err: any) {
    const str = {
      code: 400,
      message: '发布留言失败',
      error: err.message
    }
    res.send(str)
    return console.log(err.message)
  }
})
// 查询留言数量接口
router.get('/number', async (req: Request, res: Response) => {
  try {
    const data = await db.collection('message').countDocuments()
    res.send({
      code: 200,
      message: '查询留言数量成功',
      data: data
    })
  } catch (err: any) {
    const str = {
      code: 400,
      message: '查询留言数量失败',
      error: err.message
    }
    res.send(str)
    return console.log(err.message)
  }
})
// 查询弹幕接口
router.get('/dammu', async (req: Request, res: Response) => {
  const page = req.query.page as any
  try {
    const data = await getMessages(db, page, 5)
    res.send({
      code: 200,
      message: '查询留言成功',
      data
    })
  } catch (err) {
    const str = {
      code: 500,
      message: '查询留言失败',
      error: err
    }
    res.send(str)
  }
})
export default router
