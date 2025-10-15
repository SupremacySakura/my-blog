import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
/**
 * 提交访问记录
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const body = await request.json()
        const res = await db.collection('visit').insertOne(body)
        return NextResponse.json({
            code: 200,
            data: res.insertedId,
            message: '提交成功'
        })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "提交失败",
            error
        })
    }
}