import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'
import { Color } from '../types'
import {
    deleteColorBodySchema,
    deleteColorResponseSchema,
    getColorListResponseSchema,
    postColorBodySchema,
    postColorResponseSchema,
    putColorBodySchema,
    putColorResponseSchema
} from '../schemas'

const color: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // 获取所有颜色
    fastify.get('/', {
        schema: {
            response: {
                200: getColorListResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const colors = await db.collection<Color>("color").find().toArray()
            return {
                code: 200,
                data: colors,
                message: "获取成功"
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

    // 新增颜色
    fastify.post('/', {
        schema: {
            body: postColorBodySchema,
            response: {
                200: postColorResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { color, comment } = request.body

            await db.collection<Color>("color").insertOne({
                color,
                comment: comment || ""
            })

            return {
                code: 200,
                data: void 0,
                message: "添加成功"
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

    // 更新颜色
    fastify.put('/', {
        schema: {
            body: putColorBodySchema,
            response: {
                200: putColorResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { id, color, comment } = request.body

            await db.collection<Color>("color").updateOne(
                { _id: new ObjectId(id) },
                { $set: { color, comment } }
            )

            return {
                code: 200,
                data: void 0,
                message: "修改成功"
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

    // 删除颜色
    fastify.delete('/', {
        schema: {
            body: deleteColorBodySchema,
            response: {
                200: deleteColorResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { id } = request.body

            await db.collection<Color>("color").deleteOne({
                _id: new ObjectId(id)
            })

            return {
                code: 200,
                data: void 0,
                message: "删除成功"
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

export default color
