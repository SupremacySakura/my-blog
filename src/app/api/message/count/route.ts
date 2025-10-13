import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
export const GET = async() => {
    const client = await clientPromise
    const db = client.db('MyBlog')
    const count =await db.collection('message').countDocuments()
    const data = {
        code: 0,
        data: count,
        messgage: '获取成功'
    }
    return NextResponse.json(data)
}