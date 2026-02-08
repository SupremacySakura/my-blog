import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../types'
import { Saying } from './types'
import {
    deleteSayingBodySchema,
    deleteSayingResponseSchema,
    getSayingResponseSchema,
    postSayingBodySchema,
    postSayingResponseSchema,
    putSayingBodySchema,
    putSayingResponseSchema
} from './schemas'

const saying: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // 获取所有名言
    fastify.get('/', {
        schema: {
            response: {
                200: getSayingResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const sayings = await db.collection<Saying>("saying").find().toArray()
            return {
                code: 200,
                data: sayings,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: [],
                message: "获取失败",
                error
            }
        }
    })

    // 添加名言
    fastify.post('/', {
        schema: {
            body: postSayingBodySchema,
            response: {
                200: postSayingResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { text } = request.body

            await db.collection<Saying>("saying").insertOne({ text })

            return {
                code: 200,
                data:void 0,
                message: "添加成功"
            }
        } catch (error) {
            return {
                code: 500,
                data: void 0,
                message: "添加失败",
                error
            }
        }
    })

    // 修改名言
    fastify.put('/', {
        schema: {
            body: putSayingBodySchema,
            response: {
                200: putSayingResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { id, text } = request.body

            await db.collection<Saying>("saying").updateOne(
                { _id: new ObjectId(id) },
                { $set: { text } }
            )

            return {
                code: 200,
                data: void 0,
                message: "修改成功"
            }
        } catch (error) {
            return {
                code: 500,
                data: void 0,
                message: "修改失败",
                error
            }
        }
    })

    // 删除名言
    fastify.delete('/', {
        schema: {
            body: deleteSayingBodySchema,
            response: {
                200: deleteSayingResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { id } = request.body

            await db.collection<Saying>("saying").deleteOne({
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
                data: void 0,
                message: "删除失败",
                error
            }
        }
    })
}

export default saying
