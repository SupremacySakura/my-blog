import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'

const technology: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()

  // GET / - Get all technologies
  fastify.get('/', async function (request, reply) {
    try {
        const label = await db.collection('technology').find().toArray()
        return {
            code: 200,
            data: label,
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

  // POST / - Add technology
  fastify.post('/', async function (request, reply) {
    try {
        const body = request.body as any
        const { text, src, icon, note } = body
        const data = await db.collection('technology').insertOne({
            text,
            src,
            icon,
            note
        })
        return {
            code: 200,
            data,
            message: '添加成功'
        }
    } catch (error) {
        return {
            code: 500,
            message: "添加失败",
            error
        }
    }
  })

  // PUT / - Update technology
  fastify.put('/', async function (request, reply) {
    try {
        const body = request.body as any
        const { id, text, src, icon, note } = body

        const result = await db.collection('technology').updateOne(
            { _id: new ObjectId(id) },
            { $set: { text, src, icon, note } }
        )

        return { code: 200, data: result, message: '修改成功' }
    } catch (error) {
        return {
            code: 500,
            message: "修改失败",
            error
        }
    }
  })

  // DELETE / - Delete technology
  fastify.delete('/', async function (request, reply) {
    try {
        const body = request.body as any
        const { id } = body

        const result = await db.collection('technology').deleteOne({ _id: new ObjectId(id) })

        return {
            code: 200,
            data: result,
            message: '删除成功'
        }
    } catch (error) {
        return {
            code: 500,
            message: '删除失败',
            error: String(error)
        }
    }
  })
}

export default technology
