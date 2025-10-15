import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

/**
 * 获取所有名言
 * @param request 
 * @returns 
 */
export async function GET(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const sayings = await db.collection("saying").find().toArray()
        const data = {
            code: 200,
            data: sayings,
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