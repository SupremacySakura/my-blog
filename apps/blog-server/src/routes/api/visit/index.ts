import { AppPluginAsync } from '../../../types'
import { visitBodySchema, visitResponseSchema } from './schemas'
import { Visit } from './types'

const visit: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // 提交访问记录
    fastify.post('/', {
        schema: {
            body: visitBodySchema,
            response: {
                200: visitResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const body = request.body
            await db.collection<Visit>('visit').insertOne(body)

            return {
                code: 200,
                data: void 0,
                message: '提交成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: void 0,
                message: "提交失败",
                error
            }
        }
    })
}

export default visit
