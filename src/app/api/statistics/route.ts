import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const client = await clientPromise
    const db = client.db("MyBlog")
    const articleCount = await db.collection("article").countDocuments()
    const friendCount = await db.collection("friend").countDocuments()
    const visitCount = await db.collection("visit").countDocuments()
    const data = {
        code: 0,
        data: {
            articleCount,
            friendCount,
            visitCount
        },
        messgage: '获取成功'
    }
    return NextResponse.json(data)
}