import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

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