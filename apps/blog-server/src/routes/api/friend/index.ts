import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../types'
import { Friend } from './types'
import { deleteFriendBodySchema, deleteFriendResponseSchema, getFriendListQuerySchema, getFriendListResponseSchema, postFriendBodySchema, postFriendResponseSchema, updateFriendBodySchema, updateFriendResponseSchema } from './schemas/index.'

const friend: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // Helper for GET friends
    const getFriends = async (): Promise<Friend[]> => {
        return await db.collection("friend")
            .aggregate<Friend>([
                // 关联 user 表
                {
                    $lookup: {
                        from: "user",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                // 将 user 数组解开成对象
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                // 返回 site 所有字段 + 全量 user 对象
                {
                    $project: {
                        user: 1,
                        name: 1,
                        label: 1,
                        url: 1,
                        status: 1,
                        _id: 1
                    }
                }
            ])
            .toArray()
    }

    // 获取朋友列表
    fastify.get('/', {
        schema: {
            querystring: getFriendListQuerySchema,
            response: {
                200: getFriendListResponseSchema
            }
        }
    }, async function (request, reply) {
        const { needAll } = request.query
        const needAllBool = needAll === 'true'
        let res = []
        try {
            if (needAllBool) {
                res = await getFriends()
            } else {
                res = (await getFriends()).filter(item => item.status === 1)
            }
            console.log(res)
            return {
                code: 200,
                data: res,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: [],
                message: '获取失败',
                error
            }
        }
    })

    // 申请友链
    fastify.post('/', {
        schema: {
            body: postFriendBodySchema,
            response: {
                200: postFriendResponseSchema
            }
        }
    }, async function (request, reply) {
        // Verify token
        if (!fastify.verifyAccess(request, reply)) {
            return {
                code: 401,
                data: {
                    success: false
                },
                message: '未登录或无权限',
                error: '未登录或无权限'
            }
        }

        // Get user info from token (set by verifyAccess)
        const user = (request as any).user
        const uid = user.userId || user.uid || user._id // Adjust based on token payload structure

        try {
            const body = request.body
            const { name, label, url } = body

            const newFriend = {
                user_id: uid,
                name,
                label,
                url,
                status: 0
            }
            await db.collection('friend').insertOne(newFriend)
            return {
                code: 200,
                data: {
                    success: true
                },
                message: '提交成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: {
                    success: false
                },
                message: '提交失败',
                error
            }
        }
    })

    // 删除友链
    fastify.delete('/', {
        schema: {
            body: deleteFriendBodySchema,
            response: {
                200: deleteFriendResponseSchema
            }
        }
    }, async function (request, reply) {
        const body = request.body
        const { id } = body
        if (!id) return {
            code: 400,
            data: void 0,
            message: "缺少id"
        }

        try {
            await db.collection("friend").deleteOne({ _id: new ObjectId(id) })
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

    // 更新友链展示状态
    fastify.put('/', {
        schema: {
            body: updateFriendBodySchema,
            response: {
                200: updateFriendResponseSchema
            }
        }
    }, async function (request, reply) {
        const body = request.body
        const { id, status } = body
        if (!id || typeof status !== "number") {
            return {
                code: 400,
                data: void 0,
                message: "参数错误"
            }
        }
        try {
            await db.collection("friend").updateOne(
                { _id: new ObjectId(id) },
                { $set: { status } }
            )
            return {
                code: 200,
                data: void 0,
                message: "操作成功"
            }
        } catch (error) {
            return {
                code: 500,
                data: void 0,
                message: "操作失败",
                error
            }
        }
    })
}

export default friend
