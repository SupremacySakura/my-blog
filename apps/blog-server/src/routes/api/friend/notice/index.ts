import { AppPluginAsync } from "../../../../types"


const friendNotice: AppPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        try {
            const db = fastify.mongo.db()
            const notice = await db.collection('notice').find().toArray()
            return {
                code: 200,
                data: notice,
                message: '获取成功'
            }
        } catch (error) {
            return { code: 500, message: '获取失败', error }
        }
    })
}

export default friendNotice
