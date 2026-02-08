import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'
import { Article } from '../types'
import { getArticleUrlQuerySchema, getArticleUrlResponseSchema } from '../schemas'

const url: AppPluginAsync = async (fastify, opts): Promise<void> => {

    // 获取文章飞书链接
    fastify.get('/', {
        schema: {
            querystring: getArticleUrlQuerySchema,
            response: {
                200: getArticleUrlResponseSchema
            }
        }
    }, async function (request, reply) {
        const { id } = request.query
        if (!id) {
            return {
                code: 1,
                data: {} as Article,
                message: "缺少 id 参数",
            }
        }
        try {
            const db = fastify.mongo.db()
            const data = await db.collection<Article>('article').findOne({ _id: new ObjectId(id) }) || {} as Article
            return {
                code: 0,
                data,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: {} as Article,
                message: '服务器错误,获取失败',
                error
            }
        }
    })
}

export default url
