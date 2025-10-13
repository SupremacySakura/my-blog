import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

// ✅ 工具函数：获取颜色 id（如果不存在则自动创建）
async function getOrCreateColorId(db: any, colorValue: string): Promise<string> {
    const colorCol = db.collection("color")
    const exist = await colorCol.findOne({ color: colorValue })
    if (exist) return exist._id.toString()

    const insertRes = await colorCol.insertOne({
        color: colorValue,
        comment: ""
    })
    return insertRes.insertedId.toString()
}

// ✅ 新增标签
export async function POST(request: Request) {
    const client = await clientPromise
    const db = client.db("MyBlog")
    const { text, color, backgroundColor } = await request.json()

    if (!text || !color || !backgroundColor) {
        return NextResponse.json({ code: 1, message: "缺少必填字段" })
    }

    const color_id = await getOrCreateColorId(db, color)
    const bc_id = await getOrCreateColorId(db, backgroundColor)

    await db.collection("label").insertOne({
        text,
        color_id,
        bc_id
    })

    return NextResponse.json({ code: 0, message: "添加成功" })
}

// ✅ 修改标签
export async function PUT(request: Request) {
    const client = await clientPromise
    const db = client.db("MyBlog")
    const { id, text, color, backgroundColor } = await request.json()

    if (!id) return NextResponse.json({ code: 1, message: "缺少标签 id" })

    const color_id = await getOrCreateColorId(db, color)
    const bc_id = await getOrCreateColorId(db, backgroundColor)

    await db.collection("label").updateOne(
        { _id: new ObjectId(id) },
        { $set: { text, color_id, bc_id } }
    )

    return NextResponse.json({ code: 0, message: "修改成功" })
}

// ✅ 删除标签
export async function DELETE(request: Request) {
    const client = await clientPromise
    const db = client.db("MyBlog")
    const { id } = await request.json()

    if (!id) return NextResponse.json({ code: 1, message: "缺少标签 id" })

    await db.collection("label").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ code: 0, message: "删除成功" })
}
export async function GET(request: Request) {
    const client = await clientPromise
    const db = client.db("MyBlog")
    const label = await db.collection("label").aggregate([
        // 将字符串 color_id / bc_id 转为 ObjectId
        {
            $addFields: {
                color_id_obj: { $toObjectId: "$color_id" },
                bc_id_obj: { $toObjectId: "$bc_id" }
            }
        },
        // 关联 color_id
        {
            $lookup: {
                from: "color",
                localField: "color_id_obj",
                foreignField: "_id",
                as: "color_info"
            }
        },
        // 关联 bc_id
        {
            $lookup: {
                from: "color",
                localField: "bc_id_obj",
                foreignField: "_id",
                as: "bg_info"
            }
        },
        // 投影需要的字段
        {
            $project: {
                _id: 1,
                text: 1,
                color: { $arrayElemAt: ["$color_info.color", 0] },
                backgroundColor: { $arrayElemAt: ["$bg_info.color", 0] }
            }
        }
    ]).toArray()
    const data = {
        code: 0,
        data: label,
        messgage: '获取成功'
    }
    return NextResponse.json(data)
}