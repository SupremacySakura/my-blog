import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

/**
 * 添加名言
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    try {
        const { text } = await request.json()
        const client = await clientPromise
        const db = client.db("MyBlog")

        const data = await db.collection("saying").insertOne({
            text
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
 * 删除名言
 * @param request 
 * @returns 
 */
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()
        const client = await clientPromise
        const db = client.db("MyBlog")

        const result = await db.collection("saying").deleteOne({
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
 * 修改名言
 * @param request 
 * @returns 
 */
export async function PUT(request: Request) {
    try {
        const { id, text } = await request.json()
        const client = await clientPromise
        const db = client.db("MyBlog")

        const result = await db.collection("saying").updateOne(
            { _id: new ObjectId(id) },
            { $set: { text } }
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