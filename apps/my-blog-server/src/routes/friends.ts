import express, { Request, Response } from "express"
import { db } from '../db/mongodb'
import { Db } from "mongodb"
const router = express.Router()
// MySql 查询语句
/**
 * 获取友链
 * @param db 数据库实例
 * @returns 友链
 */
const getFriends = async (db: Db) => {
  return await db.collection("friend")
    .aggregate([
      // 关联 user 表
      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      // 将 user 数组解开成对象
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      // 返回 site 所有字段 + 全量 user 对象
      {
        $project: {
          user: 1,
          name: 1,
          label: 1,
          url: 1,
          status: 1,
          user_id: 1,
          _id: 1
        }
      }
    ])
    .toArray()
}
// 查询友链
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await getFriends(db)
    res.send({
      code: 200,
      message: '查询友链成功',
      data: data
    })
  } catch (err) {
    res.send({
      code: 500,
      message: '查询友链失败',
      error: err
    })
  }
})
// 申请友链
router.post('/apply', async (req: Request, res: Response) => {
  const newFriend = {
    user_id: req.body.user_id,
    name: req.body.name,
    label: req.body.label,
    url: req.body.url,
    status: 0
  }
  try {
    const data = await db.collection('friend').insertOne(newFriend)
    res.send({
      code: 200,
      message: '申请友链成功',
      data: data
    })
  } catch (err) {
    res.send({
      code: 500,
      message: '申请友链失败',
      error: err
    })
  }
})
// 查询公告
router.get('/notice', async (req: Request, res: Response) => {
  try {
    const data = await db.collection('notice').find({}).toArray()
    res.send({
      code: 200,
      message: '查询友链成功',
      data: data
    })
  } catch (err) {
    res.send({
      code: 500,
      message: '查询友链失败',
      error: err
    })
  }
})
export default router
