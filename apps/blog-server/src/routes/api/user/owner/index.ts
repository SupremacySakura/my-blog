import { AppPluginAsync } from "../../../../types"

const owner: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()

  // GET / - 获取网站所有者
  fastify.get('/', async function (request, reply) {
    try {
        const owner = await db.collection("user").findOne({
            role: 'owner'
        })
        
        return {
            code: 200,
            data: owner,
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

export default owner
