import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../types'

const message: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // Helper for GET messages
    const getMessages = async (page = 1, pageSize = 10) => {
        const skip = (page - 1) * pageSize

        return db.collection("message")
            .aggregate([
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

    // GET / - Get messages
    fastify.get('/', async function (request, reply) {
        try {
            const { page, pageSize } = request.query as { page?: string, pageSize?: string }
            const pageNum = Number(page) || 1
            const pageSizeNum = Number(pageSize) || 5

            const message = await getMessages(pageNum, pageSizeNum)
            return {
                code: 200,
                data: message,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                message: '服务器错误',
                error
            }
        }
    })

    // POST / - Add message
    fastify.post('/', async function (request, reply) {
        // Verify token
        if (!fastify.verifyAccess(request, reply)) {
            return
        }

        // Get user info from token
        const user = (request as any).user
        const uid = user.userId || user.uid || user._id

        try {
            const body = request.body as any
            const { content } = body
            const newMessage = {
                content,
                user_id: new ObjectId(uid as string),
                time: new Date().toISOString(),
            }

            const data = await db.collection('message').insertOne(newMessage)
            return {
                code: 200,
                message: '发布留言成功',
                data: data
            }
        } catch (error) {
            return {
                code: 400,
                message: '发布留言失败',
                error
            }
        }
    })

    // DELETE / - Delete message
    fastify.delete('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { id } = body
            if (!id) return { code: 1, message: "缺少 id" }

            const result = await db.collection("message").deleteOne({ _id: new ObjectId(id) })
            return { code: 200, data: result, message: "删除成功" }
        } catch (error) {
            return { code: 500, message: "删除失败", error }
        }
    })
}

export default message
