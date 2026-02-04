import { AppPluginAsync } from '../../../types'

const visit: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // POST / - 提交访问记录
    fastify.post('/', async function (request, reply) {
        try {
            const body = request.body as any
            const res = await db.collection('visit').insertOne(body)

            return {
                code: 200,
                data: res.insertedId,
                message: '提交成功'
            }
        } catch (error) {
            return {
                code: 500,
                message: "提交失败",
                error
            }
        }
    })
}

export default visit
