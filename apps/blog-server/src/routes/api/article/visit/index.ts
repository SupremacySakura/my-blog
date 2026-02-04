import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'

const visit: AppPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { _id } = body
            if (!_id) {
                return { code: 400, message: '参数不完整' }
            }
            const db = fastify.mongo.db()

            const articleId = new ObjectId(_id as string)

            await db.collection('article').updateOne(
                { _id: articleId },
                { $inc: { visit: 1 } },
            )

            return { code: 200, message: '访问成功' }
        } catch (error) {
            return { code: 500, message: '访问失败', error }
        }
    })
}

export default visit
