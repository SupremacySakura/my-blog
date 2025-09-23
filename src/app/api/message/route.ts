import clientPromise from "@/lib/mongodb"
import { Db, ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/middleware/auth"
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
export async function GET(request: Request) {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 5
    const client = await clientPromise
    const db = client.db('MyBlog')
    const message = await getMessages(db, page, pageSize)
    const data = {
        code: 0,
        data: message,
        messgage: '获取成功'
    }
    return NextResponse.json(data)
}

const addMessage = async (request: Request, payload: { uid: string, username: string }) => {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('MyBlog')
    const { content } = body
    const newMessage = {
        content,
        user_id: new ObjectId(payload.uid),
        time: new Date().toISOString(),
    }
    try {
        const data = await db.collection('message').insertOne(newMessage)
        return NextResponse.json({
            code: 200,
            message: '发布留言成功',
            data: data
        })
    } catch (err: any) {
        return NextResponse.json({
            code: 400,
            message: '发布留言失败',
            error: err.message
        })
    }
}
export const POST = verifyToken(addMessage)