import { verifyToken } from "@/lib/middleware/auth"
import clientPromise from "@/lib/mongodb"
import { Db, ObjectId } from "mongodb"
import { NextResponse } from "next/server"

/**
 * 申请添加好友
 * @param request 
 * @param payload 
 * @returns 
 */
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
        code: 200,
        data,
        message: '提交成功'
    })
}
/**
 * 申请添加好友
 * @param request 
 * @returns 
 */
export const POST = verifyToken(applyFriend)
/**
 * 删除好友
 * @param request 
 * @returns 
 */
export const DELETE = async (request: Request) => {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ code: 400, message: "缺少id" })

    const client = await clientPromise
    const db = client.db("MyBlog")

    await db.collection("friend").deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ code: 200, message: "删除成功" })
}
/**
 * 更新好友状态
 * @param request 
 * @returns 
 */
export const PUT = async (request: Request) => {
    const { id, status } = await request.json()
    if (!id || typeof status !== "number") return NextResponse.json({ code: 400, message: "参数错误" })

    const client = await clientPromise
    const db = client.db("MyBlog")

    await db.collection("friend").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
    )
    return NextResponse.json({ code: 200, message: "操作成功" })
}
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
/**
 * 获取好友列表
 * @param request 
 * @returns 好友列表
 */
export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const needAll = url.searchParams.get('needAll') || false
        const client = await clientPromise
        const db = client.db("MyBlog")
        let res = []
        if (needAll) {
            res = await getFriends(db)
        } else {
            res = (await getFriends(db)).filter(item => item.status === 1)
        }
        const data = {
            code: 200,
            data: res,
            message: '获取成功'
        }
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ code: 500, message: '获取失败', error })
    }
}
