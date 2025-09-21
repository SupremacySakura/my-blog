import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const client = await clientPromise
    const db = client.db("MyBlog")
    const body = await request.json()
    const res = await db.collection('visit').insertOne(body)
    return NextResponse.json({
        code: 0,
        data: res.insertedId,
        message: '提交成功'
    })
}