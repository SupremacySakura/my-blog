import clientPromise from "@/lib/mongodb"
import { Db, ObjectId } from "mongodb"
import { NextResponse } from "next/server"
/**
 * 获取或创建颜色 ID
 * @param db 数据库连接
 * @param colorValue 颜色值
 * @returns 颜色 ID
 */
async function getOrCreateColorId(db: Db, colorValue: string): Promise<string> {
    const colorCol = db.collection("color")
    const exist = await colorCol.findOne({ color: colorValue })
    if (exist) return exist._id.toString()

    const insertRes = await colorCol.insertOne({
        color: colorValue,
        comment: ""
    })
    return insertRes.insertedId.toString()
}
/**
 * 添加标签
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const { text, color, backgroundColor } = await request.json()

        if (!text || !color || !backgroundColor) {
            return NextResponse.json({ code: 400, message: "缺少必填字段" })
        }

        const color_id = await getOrCreateColorId(db, color)
        const bc_id = await getOrCreateColorId(db, backgroundColor)

        await db.collection("label").insertOne({
            text,
            color_id,
            bc_id
        })

        return NextResponse.json({ code: 200, message: "添加成功" })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "添加失败",
            error
        })
    }
}
/**
 * 修改标签
 * @param request 
 * @returns 
 */
export async function PUT(request: Request) {
    try {
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

        return NextResponse.json({ code: 200, message: "修改成功" })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "修改失败",
            error
        })
    }
}
/**
 * 删除标签
 * @param request 
 * @returns 
 */
export async function DELETE(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const { id } = await request.json()

        if (!id) return NextResponse.json({ code: 400, message: "缺少标签 id" })

        await db.collection("label").deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({ code: 200, message: "删除成功" })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "删除失败",
            error
        })
    }
}
/**
 * 获取所有标签
 * @param request 
 * @returns 所有标签
 */
export async function GET(request: Request) {
    try {
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
            code: 200,
            data: label,
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