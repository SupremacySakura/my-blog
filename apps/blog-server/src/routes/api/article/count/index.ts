import { AppPluginAsync } from '../../../../types'
import { getArticleCountResponseSchema } from '../schemas'

const count: AppPluginAsync = async (fastify, opts): Promise<void> => {

    // 获取文章数量
    fastify.get('/', {
        schema: {
            response: {
                200: getArticleCountResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const db = fastify.mongo.db()
            const articleCollection = db.collection('article')
            const count = await articleCollection.countDocuments()
            return {
                code: 200,
                data: count,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: 0,
                message: '服务器错误,获取失败',
                error
            }
        }
    })
}

export default count
