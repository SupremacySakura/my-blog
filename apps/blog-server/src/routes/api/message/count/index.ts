import { AppPluginAsync } from "../../../../types"
import { getMessageCountResponseSchema } from "../schemas"

const messageCount: AppPluginAsync = async (fastify, opts): Promise<void> => {

  // 获取留言数量
  fastify.get('/', {
    schema: {
      response: {
        200: getMessageCountResponseSchema
      }
    }
  }, async function (request, reply) {
    try {
      const db = fastify.mongo.db()
      const count = await db.collection('message').countDocuments()
      return {
        code: 200,
        data: count,
        message: '获取成功'
      }
    } catch (error) {
      return {
        code: 500,
        message: '服务器错误',
        data: 0,
        error
      }
    }
  })
}

export default messageCount
