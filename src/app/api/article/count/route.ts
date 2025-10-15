import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

/**
 * 获取文章数量
 * @param request 
 * @returns 文章数量
 */
export const GET = async () => {
    try {
        const client = await clientPromise
        const db = client.db('MyBlog')
        const count = await db.collection('article').countDocuments()
        const data = {
            code: 200,
            data: count,
            message: '获取成功'
        }
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: '服务器错误,获取失败',
            error
        })
    }
}