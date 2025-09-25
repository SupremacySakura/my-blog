import { verifyToken } from "@/lib/middleware/auth"
import clientPromise from "@/lib/mongodb"
import { Db } from "mongodb"
import { NextResponse } from "next/server"

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
                    _id: 1
                }
            }
        ])
        .toArray()
}
export async function GET(request: Request) {
    const client = await clientPromise
    const db = client.db("MyBlog")
    const res = (await getFriends(db)).filter(item => item.status === 1)
    const data = {
        code: 0,
        data: res,
        messgage: '获取成功'
    }
    return NextResponse.json(data)
}
const applyFriend = async (request: Request, payload: { uid: string, username: string }) => {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("MyBlog")
    const { name, label, url } = body
    const newFriend = {
        user_id: payload.uid,
        name,
        label,
        url,
        status: 0
    }
    const data = await db.collection('friend').insertOne(newFriend)
    return NextResponse.json({
        code: 0,
        data,
        message: '提交成功'
    })
}
export const POST = verifyToken(applyFriend)