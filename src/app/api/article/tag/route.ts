import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { tag } = await request.json()
        if (!tag) return NextResponse.json({ code: 400, message: '标签不能为空' })

        const client = await clientPromise
        const db = client.db('MyBlog')
        const result = await db.collection('tag').insertOne({ tag })
        return NextResponse.json({
            code: 0,
            data: { _id: result.insertedId, tag },
            message: '添加成功'
        })
    } catch (error) {
        return NextResponse.json({ code: 500, message: '添加失败', error: error })
    }
}
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()
        if (!id) return NextResponse.json({ code: 400, message: '缺少 id' })

        const client = await clientPromise
        const db = client.db('MyBlog')
        const result = await db.collection('tag').deleteOne({ _id: new ObjectId(id) })
        if (result.deletedCount === 1) {
            return NextResponse.json({ code: 0, message: '删除成功' })
        } else {
            return NextResponse.json({ code: 404, message: '未找到标签' })
        }
    } catch (error) {
        return NextResponse.json({ code: 500, message: '删除失败', error: error })
    }
}
export async function PUT(request: Request) {
    try {
        const { id, tag } = await request.json()
        if (!id || !tag) return NextResponse.json({ code: 400, message: '参数不完整' })

        const client = await clientPromise
        const db = client.db('MyBlog')
        const result = await db.collection('tag').updateOne(
            { _id: new ObjectId(id) },
            { $set: { tag } }
        )
        if (result.modifiedCount === 1) {
            return NextResponse.json({ code: 0, message: '修改成功' })
        } else {
            return NextResponse.json({ code: 404, message: '未找到标签或未修改' })
        }
    } catch (error) {
        return NextResponse.json({ code: 500, message: '修改失败', error: error })
    }
}
export async function GET(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db('MyBlog')
        const data = await db.collection('tag').find().toArray()
        return NextResponse.json({
            code: 0,
            data,
            message: '获取成功'
        })
    } catch (error) {
        return NextResponse.json({ code: 500, message: '获取失败', error: error })
    }
}