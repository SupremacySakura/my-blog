import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

/**
 * 获取公告通知
 * @param request 
 * @returns 公告通知列表
 */
export async function GET(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const notice = await db.collection('notice').find().toArray()
        const data = {
            code: 200,
            data: notice,
            message: '获取成功'
        }
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ code: 500, message: '获取失败', error })
    }

}