import { AppPluginAsync } from '../../../../types'

const count: AppPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        try {
            const db = fastify.mongo.db()
            const count = await db.collection('article').countDocuments()
            return {
                code: 200,
                data: count,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                message: '服务器错误,获取失败',
                error
            }
        }
    })
}

export default count
