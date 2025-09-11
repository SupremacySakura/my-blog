import express, { Router, Request, Response } from "express"
import dayjs from "dayjs"
import { db } from '../db/mongodb'
import { Db } from "mongodb"
const router: Router = express.Router()
/**
 * 获取朋友圈动态
 * @param db 数据库连接
 * @returns 动态
 */
const getMoments = async (db: Db) => {
  const moments = await db.collection("moment")
    .aggregate([
      // 把 user_id 转成 ObjectId
      {
        $addFields: {
          user_id: { $toObjectId: "$user_id" }
        }
      },
      {
        $lookup: {
          from: "user",               // 关联的集合
          localField: "user_id",      // message.user_id
          foreignField: "_id",        // user._id
          as: "user"                  // 结果存放到 user 字段
        }
      },
      { $unwind: "$user" },           // user 是数组，解开成对象
      { $sort: { time: -1 } }         // 按时间倒序
    ])
    .toArray()

  return moments.map(msg => ({
    ...msg,
    time: dayjs(msg.time).format("YYYY-MM-DD HH:mm:ss")
  }))
}
// 查询朋友圈接口
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await getMoments(db)
    res.send({
      code: 200,
      message: '查询成功',
      data: data
    })
  } catch (err) {
    res.send({
      code: 500,
      message: '查询失败',
      error: err
    })
  }
})
// 查询技术栈接口
router.get('/technology', async(req: Request, res: Response) => {
  try {
    const data = await db.collection('technology').find().toArray()
    res.send({
      code: 200,
      message: '查询成功',
      data: data
    })
  } catch (err) {
    res.send({
      code: 500,
      message: '查询失败',
      error: err
    })
  }
})
export default router
