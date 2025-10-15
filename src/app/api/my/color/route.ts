import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
/**
 * 添加颜色
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    try {
        const { color, comment } = await request.json()
        const client = await clientPromise
        const db = client.db("MyBlog")

        const data = await db.collection("color").insertOne({
            color,
            comment
        })

        return NextResponse.json({
            code: 200,
            data,
            message: "添加成功"
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
 * 删除颜色
 * @param request 
 * @returns 
 */
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()
        const client = await clientPromise
        const db = client.db("MyBlog")

        const result = await db.collection("color").deleteOne({
            _id: new ObjectId(id)
        })

        return NextResponse.json({
            code: 200,
            data: result,
            message: "删除成功"
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            code: 500,
            message: "删除失败",
            error
        })
    }
}
/**
 * 修改颜色
 * @param request 
 * @returns 
 */
export async function PUT(request: Request) {
    try {
        const { id, color, comment } = await request.json()
        const client = await clientPromise
        const db = client.db("MyBlog")

        const result = await db.collection("color").updateOne(
            { _id: new ObjectId(id) },
            { $set: { color, comment } }
        )

        return NextResponse.json({
            code: 200,
            data: result,
            message: "修改成功"
        })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "修改失败",
            error
        })
    }
}

/**
 * 获取所有颜色
 * @param request 
 * @returns 所有颜色
 */
export async function GET(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const colors = await db.collection("color").find().toArray()

        return NextResponse.json({
            code: 200,
            data: colors,
            message: "获取成功"
        })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "获取失败",
            error
        })
    }
}
