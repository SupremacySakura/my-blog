import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'

const color: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()

  // GET / - Get all colors
  fastify.get('/', async function (request, reply) {
    try {
        const colors = await db.collection("color").find().toArray()
        return {
            code: 200,
            data: colors,
            message: "获取成功"
        }
    } catch (error) {
        return {
            code: 500,
            message: "获取失败",
            error
        }
    }
  })

  // POST / - Add color
  fastify.post('/', async function (request, reply) {
    try {
        const body = request.body as any
        const { color, comment } = body

        const data = await db.collection("color").insertOne({
            color,
            comment
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

  // PUT / - Update color
  fastify.put('/', async function (request, reply) {
    try {
        const body = request.body as any
        const { id, color, comment } = body

        const result = await db.collection("color").updateOne(
            { _id: new ObjectId(id) },
            { $set: { color, comment } }
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

  // DELETE / - Delete color
  fastify.delete('/', async function (request, reply) {
    try {
        const body = request.body as any
        const { id } = body

        const result = await db.collection("color").deleteOne({
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

export default color
