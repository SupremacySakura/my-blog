import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
    const url = new URL(request.url)
    const _id = url.searchParams.get('id')
    if (!_id) {
        return NextResponse.json({
            code: 1,
            data: null,
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
}