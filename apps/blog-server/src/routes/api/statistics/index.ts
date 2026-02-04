import { AppPluginAsync } from "../../../types"

const statistics: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()

  // GET / - 获取统计数据
  fastify.get('/', async function (request, reply) {
    try {
        const articleCount = await db.collection("article").countDocuments()
        const friendCount = await db.collection("friend").countDocuments()
        const visitCount = await db.collection("visit").countDocuments()
        
        return {
            code: 200,
            data: {
                articleCount,
                friendCount,
                visitCount
            },
            message: '获取成功'
        }
    } catch (error) {
        return {
            code: 500,
            message: "获取失败",
            error
        }
    }
  })
}

export default statistics
