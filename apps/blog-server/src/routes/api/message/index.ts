import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../types'
import { Message, MessageDB } from './types'
import {
    deleteMessageBodySchema,
    deleteMessageResponseSchema,
    getMessageListQuerySchema,
    getMessageListResponseSchema,
    postMessageBodySchema,
    postMessageResponseSchema
} from './schemas'

const message: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // Helper for GET messages
    const getMessages = async (page = 1, pageSize = 10): Promise<Message[]> => {
        const skip = (page - 1) * pageSize

        return db.collection<MessageDB>("message")
            .aggregate<Message>([
                // 如果 user_id 是字符串，先转 ObjectId
                {
                    $addFields: {
                        user_id: {
                            $convert: {
                                input: "$user_id",
                                to: "objectId",
                                onError: "$user_id",
                                onNull: "$user_id"
                            }
                        }
                    }
                },
                // 联合 user 表
                {
                    $lookup: {
                        from: "user",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                // 展开 user
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                // 按 _id 倒序
                { $sort: { _id: -1 } },
                // 分页
                { $skip: skip },
                { $limit: pageSize }
            ])
            .toArray()
    }

    // 获取留言列表
    fastify.get('/', {
        schema: {
            querystring: getMessageListQuerySchema,
            response: {
                200: getMessageListResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { page, pageSize } = request.query
            const pageNum = Number(page) || 1
            const pageSizeNum = Number(pageSize) || 5

            const message = await getMessages(pageNum, pageSizeNum)
            return {
                code: 200,
                data: message,
                message: '获取留言列表成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: [],
                message: '服务器错误',
                error
            }
        }
    })

    // 新增留言
    fastify.post('/', {
        schema: {
            body: postMessageBodySchema,
            response: {
                200: postMessageResponseSchema
            }
        }
    }, async function (request, reply) {
        // Verify token
        if (!fastify.verifyAccess(request, reply)) {
            return
        }

        // Get user info from token
        const user = (request as any).user
        const uid = user.userId || user.uid || user._id

        try {
            const { content } = request.body
            const newMessage = {
                content,
                user_id: new ObjectId(uid as string),
                time: new Date().toISOString(),
            }

            await db.collection<MessageDB>('message').insertOne(newMessage)
            return {
                code: 200,
                message: '发布留言成功',
                data: void 0
            }
        } catch (error) {
            return {
                code: 400,
                message: '发布留言失败',
                data: void 0,
                error
            }
        }
    })

    // 删除留言
    fastify.delete('/', {
        schema: {
            body: deleteMessageBodySchema,
            response: {
                200: deleteMessageResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { id } = request.body
            if (!id) return {
                code: 400,
                message: "缺少 id",
                data: void 0
            }

            await db.collection<MessageDB>("message").deleteOne({ _id: new ObjectId(id) })
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

export default message
