import { AppPluginAsync } from "../../../../types"
import { getNoticeListResponseSchema } from "../schemas/index."
import { Notice } from "../types"


const friendNotice: AppPluginAsync = async (fastify, opts): Promise<void> => {

    // 获取公告
    fastify.get('/', {
        schema: {
            response: {
                200: getNoticeListResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const db = fastify.mongo.db()
            const notice = await db.collection<Notice>('notice').find().toArray()
            return {
                code: 200,
                data: notice,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: [] as Notice[],
                message: '获取失败',
                error
            }
        }
    })
}

export default friendNotice
