import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../types'

const friend: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // Helper for GET friends
    const getFriends = async () => {
        return await db.collection("friend")
            .aggregate([
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

    // GET / - Get friend list
    fastify.get('/', async function (request, reply) {
        try {
            const { needAll } = request.query as { needAll?: string }
            const needAllBool = needAll === 'true'

            let res = []
            if (needAllBool) {
                res = await getFriends()
            } else {
                res = (await getFriends()).filter(item => item.status === 1)
            }
            return {
                code: 200,
                data: res,
                message: '获取成功'
            }
        } catch (error) {
            return { code: 500, message: '获取失败', error }
        }
    })

    // POST / - Apply for friend
    fastify.post('/', async function (request, reply) {
        // Verify token
        if (!fastify.verifyAccess(request, reply)) {
            return // verifyAccess sends the response if failed
        }

        // Get user info from token (set by verifyAccess)
        const user = (request as any).user
        const uid = user.userId || user.uid || user._id // Adjust based on token payload structure

        try {
            const body = request.body as any
            const { name, label, url } = body

            const newFriend = {
                user_id: uid,
                name,
                label,
                url,
                status: 0
            }
            const result = await db.collection('friend').insertOne(newFriend)
            return {
                code: 200,
                data: result,
                message: '提交成功'
            }
        } catch (error) {
            return { code: 500, message: '提交失败', error }
        }
    })

    // DELETE / - Delete friend
    fastify.delete('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { id } = body
            if (!id) return { code: 400, message: "缺少id" }

            await db.collection("friend").deleteOne({ _id: new ObjectId(id) })
            return { code: 200, message: "删除成功" }
        } catch (error) {
            return { code: 500, message: "删除失败", error }
        }
    })

    // PUT / - Update friend status
    fastify.put('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { id, status } = body
            if (!id || typeof status !== "number") return { code: 400, message: "参数错误" }

            await db.collection("friend").updateOne(
                { _id: new ObjectId(id) },
                { $set: { status } }
            )
            return { code: 200, message: "操作成功" }
        } catch (error) {
            return { code: 500, message: "操作失败", error }
        }
    })
}

export default friend
