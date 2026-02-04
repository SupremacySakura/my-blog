import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'

const tag: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // GET / - Get all tags
    fastify.get('/', async function (request, reply) {
        try {
            const data = await db.collection('tag').find().toArray()
            return {
                code: 200,
                data,
                message: '获取成功'
            }
        } catch (error) {
            return { code: 500, message: '获取失败', error }
        }
    })

    // POST / - Add tag
    fastify.post('/', async function (request, reply) {
        try {
            const { tag } = request.body as any
            if (!tag) return { code: 400, message: '标签不能为空' }

            const result = await db.collection('tag').insertOne({ tag })
            return {
                code: 200,
                data: { _id: result.insertedId, tag },
                message: '添加成功'
            }
        } catch (error) {
            return { code: 500, message: '服务器错误,添加失败', error }
        }
    })

    // PUT / - Update tag
    fastify.put('/', async function (request, reply) {
        try {
            const { id, tag } = request.body as any
            if (!id || !tag) return { code: 400, message: '参数不完整' }

            const result = await db.collection('tag').updateOne(
                { _id: new ObjectId(id) },
                { $set: { tag } }
            )
            if (result.modifiedCount === 1) {
                return { code: 200, data: { _id: new ObjectId(id), tag }, message: '修改成功' }
            } else {
                return { code: 404, message: '未找到标签或未修改' }
            }
        } catch (error) {
            return { code: 500, message: '修改失败', error }
        }
    })

    // DELETE / - Delete tag
    fastify.delete('/', async function (request, reply) {
        try {
            const { id } = request.body as any
            if (!id) return { code: 400, message: '缺少 id' }

            const result = await db.collection('tag').deleteOne({ _id: new ObjectId(id) })
            if (result.deletedCount === 1) {
                return { code: 200, data: { _id: new ObjectId(id) }, message: '删除成功' }
            } else {
                return { code: 404, message: '未找到标签' }
            }
        } catch (error) {
            return { code: 500, message: '删除失败', error }
        }
    })
}

export default tag
