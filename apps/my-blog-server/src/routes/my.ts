import express, { Router, Request, Response } from "express";
import { db } from '../db/mongodb'
import { Db } from "mongodb";
const router: Router = express.Router();
/**
 * 获取个人信息
 * @param db 数据库
 * @returns 个人信息
 */
const getMyInfo = async (db: Db) => {
  const myCollection = db.collection("my");
  const userCollection = db.collection("user");

  // 查询 my 集合唯一文档
  const myDoc = await myCollection.findOne({});
  if (!myDoc) return null;
  const user_id = myDoc.user_id;
  // 查询对应 user
  const user = await userCollection.findOne({ _id: user_id });

  // 合并结果
  return {
    ...myDoc,
    ...(user || {})
  };
};
// 查询个人信息自我介绍
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await getMyInfo(db)
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
/**
 * 获取个人标签
 * @param db 数据库
 * @returns 个人标签
 */
const getLabels = async (db: Db) => {
  return await db.collection("label").aggregate([
    // 将字符串 color_id / bc_id 转为 ObjectId
    {
      $addFields: {
        color_id_obj: { $toObjectId: "$color_id" },
        bc_id_obj: { $toObjectId: "$bc_id" }
      }
    },
    // 关联 color_id
    {
      $lookup: {
        from: "color",
        localField: "color_id_obj",
        foreignField: "_id",
        as: "color_info"
      }
    },
    // 关联 bc_id
    {
      $lookup: {
        from: "color",
        localField: "bc_id_obj",
        foreignField: "_id",
        as: "bg_info"
      }
    },
    // 投影需要的字段
    {
      $project: {
        _id: 1,
        text: 1,
        color: { $arrayElemAt: ["$color_info.color", 0] },
        backgroundColor: { $arrayElemAt: ["$bg_info.color", 0] }
      }
    }
  ]).toArray();
};
// 查询标签
router.get('/labels', async(req: Request, res: Response) => {
  try {
    const data = await getLabels(db)
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
