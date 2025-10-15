import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
/**
 * 添加技术
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    try {
        const { text, src, icon, note } = await request.json()
        const client = await clientPromise
        const db = client.db("MyBlog")
        const data = await db.collection('technology').insertOne({
            text,
            src,
            icon,
            note
        })
        return NextResponse.json({
            code: 200,
            data,
            message: '添加成功'
        })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "添加失败",
            error
        })
    }
}
/**
 * 删除技术
 * @param request 
 * @returns 
 */
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()
        const client = await clientPromise
        const db = client.db("MyBlog")

        // 将字符串id转换为ObjectId
        const result = await db.collection('technology').deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({
            code: 200,
            data: result,
            message: '删除成功'
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            code: 500,
            message: '删除失败',
            error: String(error)
        })
    }
}
/**
 * 修改技术
 * @param request 
 * @returns 
 */
export async function PUT(request: Request) {
    try {
        const { id, text, src, icon, note } = await request.json()
        const client = await clientPromise
        const db = client.db("MyBlog")

        const result = await db.collection('technology').updateOne(
            { _id: new ObjectId(id) },
            { $set: { text, src, icon, note } }
        )

        return NextResponse.json({ code: 200, data: result, message: '修改成功' })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "修改失败",
            error
        })
    }
}
/**
 * 获取所有技术
 * @param request 
 * @returns 所有技术
 */
export async function GET(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const label = await db.collection('technology').find().toArray()
        return NextResponse.json({
            code: 200,
            data: label,
            message: '获取成功'
        })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "获取失败",
            error
        })
    }
}