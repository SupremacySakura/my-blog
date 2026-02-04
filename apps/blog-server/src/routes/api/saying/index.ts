import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../types'

const saying: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // GET / - 获取所有名言
    fastify.get('/', async function (request, reply) {
        try {
            const sayings = await db.collection("saying").find().toArray()
            return {
                code: 200,
                data: sayings,
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

    // POST / - 添加名言
    fastify.post('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { text } = body

            const data = await db.collection("saying").insertOne({
                text
            })

            return {
                code: 200,
                data,
                message: "添加成功"
            }
        } catch (error) {
            return {
                code: 500,
                message: "添加失败",
                error
            }
        }
    })

    // PUT / - 修改名言
    fastify.put('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { id, text } = body

            const result = await db.collection("saying").updateOne(
                { _id: new ObjectId(id) },
                { $set: { text } }
            )

            return {
                code: 200,
                data: result,
                message: "修改成功"
            }
        } catch (error) {
            return {
                code: 500,
                message: "修改失败",
                error
            }
        }
    })

    // DELETE / - 删除名言
    fastify.delete('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { id } = body

            const result = await db.collection("saying").deleteOne({
                _id: new ObjectId(id)
            })

            return {
                code: 200,
                data: result,
                message: "删除成功"
            }
        } catch (error) {
            return {
                code: 500,
                message: "删除失败",
                error
            }
        }
    })
}

export default saying
