import clientPromise from "@/lib/mongodb"
import { Db, ObjectId } from "mongodb"
import { NextResponse } from "next/server"


/**
 * POST - 文章访问量加一
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { _id } = body
        if (!_id) {
            return NextResponse.json({ code: 400, message: '参数不完整' })
        }
        const client = await clientPromise
        const db = client.db('MyBlog')

        const articleId = new ObjectId(_id as string)

        await db.collection('article').updateOne(
            { _id: articleId },
            { $inc: { visit: 1 } },
        )

        return NextResponse.json({ code: 200, message: '访问成功' })
    } catch (error) {
        return NextResponse.json({ code: 500, message: '访问失败', error })
    }
}

