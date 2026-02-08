import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'
import { Technology } from '../types'
import {
    deleteTechnologyBodySchema,
    deleteTechnologyResponseSchema,
    getTechnologyListResponseSchema,
    postTechnologyBodySchema,
    postTechnologyResponseSchema,
    putTechnologyBodySchema,
    putTechnologyResponseSchema
} from '../schemas'

const technology: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()

  // 获取技术栈
  fastify.get('/', {
    schema: {
        response: {
            200: getTechnologyListResponseSchema
        }
    }
  }, async function (request, reply) {
    try {
        const label = await db.collection<Technology>('technology').find().toArray()
        return {
            code: 200,
            data: label,
            message: '获取成功'
        }
    } catch (error) {
        return {
            code: 500,
            message: "获取失败",
            data: [],
            error
        }
    }
  })

  // 新增技术栈
  fastify.post('/', {
    schema: {
        body: postTechnologyBodySchema,
        response: {
            200: postTechnologyResponseSchema
        }
    }
  }, async function (request, reply) {
    try {
        const { text, src, icon, note, photo, height } = request.body
        await db.collection<Technology>('technology').insertOne({
            text,
            src,
            icon,
            note,
            photo,
            height
        } as any)
        return {
            code: 200,
            data:void 0,
            message: '添加成功'
        }
    } catch (error) {
        return {
            code: 500,
            message: "添加失败",
            data: void 0,
            error
        }
    }
  })

  // 修改技术栈
  fastify.put('/', {
    schema: {
        body: putTechnologyBodySchema,
        response: {
            200: putTechnologyResponseSchema
        }
    }
  }, async function (request, reply) {
    try {
        const { id, text, src, icon, note, photo, height } = request.body

        await db.collection<Technology>('technology').updateOne(
            { _id: new ObjectId(id) },
            { $set: { text, src, icon, note, photo, height } }
        )

        return { code: 200, data: void 0, message: '修改成功' }
    } catch (error) {
        return {
            code: 500,
            message: "修改失败",
            data: void 0,
            error
        }
    }   
  })

  // 删除技术栈
  fastify.delete('/', {
    schema: {
        body: deleteTechnologyBodySchema,
        response: {
            200: deleteTechnologyResponseSchema
        }
    }
  }, async function (request, reply) {
    try {
        const { id } = request.body

        await db.collection<Technology>('technology').deleteOne({ _id: new ObjectId(id) })

        return {
            code: 200,
            data: void 0,
            message: '删除成功'
        }
    } catch (error) {
        return {
            code: 500,
            message: '删除失败',
            data: void 0,
            error: String(error)
        }
    }
  })
}

export default technology
