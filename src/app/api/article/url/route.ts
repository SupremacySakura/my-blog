import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

/**
 * 获取文章
 * @param request 
 * @returns 文章
 */
export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const _id = url.searchParams.get('id')
        if (!_id) {
            return NextResponse.json({
                code: 1,
                message: "缺少 id 参数",
            });
        }
        const client = await clientPromise
        const db = client.db('MyBlog')
        const data = await db.collection('article').findOne({ _id: new ObjectId(_id) })
        return NextResponse.json({
            code: 0,
            data,
            message: '获取成功'
        })
    } catch (error) {
        return NextResponse.json({ code: 500, message: '服务器错误,获取失败', error })
    }
}