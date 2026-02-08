import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'
import { postArticleVisitBodySchema, postArticleVisitResponseSchema } from '../schemas'

const visit: AppPluginAsync = async (fastify, opts): Promise<void> => {

    // 增加文章观看量
    fastify.post('/', {
        schema: {
            body: postArticleVisitBodySchema,
            response: {
                200: postArticleVisitResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const body = request.body
            const { id } = body
            if (!id) {
                return {
                    code: 400,
                    data: void 0,
                    message: '参数不完整'
                }
            }
            const db = fastify.mongo.db()

            const articleId = new ObjectId(id)

            await db.collection('article').updateOne(
                { _id: articleId },
                { $inc: { visit: 1 } },
            )

            return {
                code: 200,
                data: void 0,
                message: '访问成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: void 0,
                message: '访问失败',
                error
            }
        }
    })
}

export default visit
