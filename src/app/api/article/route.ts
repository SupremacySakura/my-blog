import clientPromise from "@/lib/mongodb"
import { Db } from "mongodb"
import { NextResponse } from "next/server"

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
                user: 1,  // 保留完整 user 对象
                visit:1
            }
        }
    ]).toArray()
}
export async function GET(request: Request) {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 4
    const client = await clientPromise
    const db = client.db('MyBlog')
    const data = await getArticles(db, page, pageSize)
    return NextResponse.json({
        code: 0,
        data,
        message: '获取成功'
    })
}