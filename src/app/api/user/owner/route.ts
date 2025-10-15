import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
/**
 * 获取网站所有者
 * @param request 
 * @returns 
 */
export async function GET(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const owner = await db.collection("user").findOne({
            role: 'owner'
        })
        const data = {
            code: 200,
            data: owner,
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