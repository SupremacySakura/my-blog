import { AppPluginAsync } from '../../../types'

const address: AppPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        try {
            const db = fastify.mongo.db()
            const address = await db.collection("address").find().toArray()
            return {
                code: 200,
                data: address,
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

export default address
