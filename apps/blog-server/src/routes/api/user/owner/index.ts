import { AppPluginAsync } from "../../../../types"
import { getOwnerSchema } from "../schemas"
import { User } from "../types"

const owner: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // 获取网站所有者
    fastify.get('/', {
        schema: {
            response: {
                200: getOwnerSchema
            }
        }
    }, async function (request, reply) {
        try {
            const owner = await db.collection<User>("user").findOne({
                role: 'owner'
            }) || {} as User

            return {
                code: 200,
                data: owner,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                message: "获取失败",
                data: {} as User,
                error
            }
        }
    })
}

export default owner
