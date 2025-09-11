import express, { Request, Response } from "express"
import { db } from '../db/mongodb'
import { Db } from "mongodb"
const router = express.Router()
/**
 * 获取文章
 * @param page 页码 
 * @param pageSize 页面大小
 * @returns 文章数据
 */
const getArticles = async (db: Db, page = 1, pageSize = 4) => {
  const skip = (page - 1) * pageSize
  return await db.collection("article").aggregate([
    {
      $addFields: {
        user_id: { $toObjectId: "$user_id" }
      }
    },
    // 按时间倒序
    { $sort: { time: -1 } },

    // 分页
    { $skip: skip },
    { $limit: pageSize },

    // 关联 tag 表
    {
      $lookup: {
        from: "tag",
        localField: "tag",        // article.tag (数组存 tag._id)
        foreignField: "_id",
        as: "tags"
      }
    },

    // 关联 user 表并展开
    {
      $lookup: {
        from: "user",
        localField: "user_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

    // 返回文章字段 + 全量 user 对象
    {
      $project: {
        _id: 1,
        head: 1,
        digest: 1,
        article: 1,
        time: 1,
        cover: 1,
        tags: { _id: 1, tag: 1 },
        user: 1  // 保留完整 user 对象
      }
    }
  ]).toArray()
}

// 查询文章接口
router.get('/', async (req: Request, res: Response) => {
  const page = req.query.page as any
  try {
    const data = await getArticles(db, page, 4)
    res.send({
      code: 200,
      message: '查询文章成功',
      data: data
    })
  } catch (err: any) {
    const str = {
      code: 400,
      message: '查询文章失败',
      error: err.message
    }
    res.send(str)
    return console.log(err.message)
  }

})
// 查询文章数量接口
router.get('/number', async (req: Request, res: Response) => {
  try {
    const data = await db.collection('article').countDocuments()
    res.send({
      code: 200,
      message: '查询文章数量成功',
      data: data
    })
  } catch (err: any) {
    const str = {
      code: 400,
      message: '查询文章数量失败',
      error: err.message
    }
    res.send(str)
    return console.log(err.message)
  }
})
/**
 * 查询文章标签
 * @returns 文章标签
 */
const getArticleTag = async (db: Db) => {
  const result = await db.collection('tag').find().toArray()
  return result
}
// 查询文章标签接口
router.get('/tag', async (req: Request, res: Response) => {
  try {
    const data = await getArticleTag(db)
    res.send({
      code: 200,
      message: '查询文章标签成功',
      data: data
    })
  } catch (err: any) {
    const str = {
      code: 400,
      message: '查询文章标签失败',
      error: err.message
    }
    res.send(str)
    return console.log(err.message)
  }
})
export default router
