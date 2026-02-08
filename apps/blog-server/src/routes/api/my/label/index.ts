import { ObjectId, Db } from 'mongodb'
import { AppPluginAsync } from '../../../../types'
import { Label, LabelDB } from '../types'
import {
    deleteLabelBodySchema,
    deleteLabelResponseSchema,
    getLabelListResponseSchema,
    postLabelBodySchema,
    postLabelResponseSchema,
    putLabelBodySchema,
    putLabelResponseSchema
} from '../schemas'

const label: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // Helper function
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

    // 获取所有标签
    fastify.get('/', {
        schema: {
            response: {
                200: getLabelListResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const label = await db.collection<LabelDB>("label").aggregate<Label>([
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

            return {
                code: 200,
                data: label,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                message: "获取失败",
                data: [],
                error
            }
        }
    })

    // 新增标签
    fastify.post('/', {
        schema: {
            body: postLabelBodySchema,
            response: {
                200: postLabelResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { text, color, backgroundColor } = request.body

            if (!text || !color || !backgroundColor) {
                return {
                    code: 400,
                    message: "缺少必填字段",
                    data: void 0
                }
            }

            const color_id = await getOrCreateColorId(db, color)
            const bc_id = await getOrCreateColorId(db, backgroundColor)

            await db.collection<LabelDB>("label").insertOne({
                text,
                color_id,
                bc_id
            })

            return {
                code: 200,
                message: "添加成功",
                data: void 0
            }
        } catch (error) {
            return {
                code: 500,
                message: "添加失败",
                data: void 0,
                error
            }
        }
    })

    // 更新标签
    fastify.put('/', {
        schema: {
            body: putLabelBodySchema,
            response: {
                200: putLabelResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { id, text, color, backgroundColor } = request.body

            if (!id) return {
                code: 400,
                message: "缺少标签 id",
                data: void 0
            }

            const color_id = await getOrCreateColorId(db, color)
            const bc_id = await getOrCreateColorId(db, backgroundColor)

            await db.collection<LabelDB>("label").updateOne(
                { _id: new ObjectId(id) },
                { $set: { text, color_id, bc_id } }
            )

            return {
                code: 200,
                message: "修改成功",
                data: void 0
            }
        } catch (error) {
            return {
                code: 500,
                message: "修改失败",
                data: void 0,
                error
            }
        }
    })

    // 删除标签
    fastify.delete('/', {
        schema: {
            body: deleteLabelBodySchema,
            response: {
                200: deleteLabelResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { id } = request.body

            if (!id) return {
                code: 400,
                message: "缺少标签 id",
                data: void 0
            }

            await db.collection<LabelDB>("label").deleteOne({ _id: new ObjectId(id) })

            return {
                code: 200,
                message: "删除成功",
                data: void 0
            }
        } catch (error) {
            return {
                code: 500,
                message: "删除失败",
                data: void 0,
                error
            }
        }
    })
}

export default label
