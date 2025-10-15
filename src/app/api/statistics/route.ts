import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

/**
 * 获取统计数据
 * @param request 
 * @returns 
 */
export async function GET(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const articleCount = await db.collection("article").countDocuments()
        const friendCount = await db.collection("friend").countDocuments()
        const visitCount = await db.collection("visit").countDocuments()
        const data = {
            code: 200,
            data: {
                articleCount,
                friendCount,
                visitCount
            },
            message: '获取成功'
        }
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "获取失败",
            error
        })
    }
}