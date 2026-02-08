import { AppPluginAsync } from "../../../types"
import { statisticsResponseSchema } from "./schemas"

const statistics: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // 获取统计数据
    fastify.get('/', {
        schema: {
            response: {
                200: statisticsResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const articleCount = await db.collection("article").countDocuments()
            const friendCount = await db.collection("friend").countDocuments()
            const visitCount = await db.collection("visit").countDocuments()

            return {
                code: 200,
                data: {
                    articleCount,
                    friendCount,
                    visitCount
                },
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: {
                    articleCount: 0,
                    friendCount: 0,
                    visitCount: 0
                },
                message: "获取失败",
                error
            }
        }
    })
}

export default statistics
