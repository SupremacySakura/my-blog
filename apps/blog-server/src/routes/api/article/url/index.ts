import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'

const url: AppPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        try {
            const { id } = request.query as any
            if (!id) {
                return {
                    code: 1,
                    message: "缺少 id 参数",
                };
            }
            const db = fastify.mongo.db()
            const data = await db.collection('article').findOne({ _id: new ObjectId(id) })
            return {
                code: 0,
                data,
                message: '获取成功'
            }
        } catch (error) {
            return { code: 500, message: '服务器错误,获取失败', error }
        }
    })
}

export default url
