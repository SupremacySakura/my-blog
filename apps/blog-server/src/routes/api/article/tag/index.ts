import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'
import { addTagBodySchema, deleteTagBodySchema, deleteTagResponseSchema, getTagResponseSchema, postTagResponseSchema, putTagResponseSchema, updateTagBodySchema } from '../schemas'
import { Tag } from '../types'

const tag: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()
    const tagCollection = db.collection<Tag>('tag')

    // 获取文章标签
    fastify.get('/', {
        schema: {
            response: {
                200: getTagResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const data = await tagCollection.find().toArray()
            return {
                code: 200,
                data,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: [],
                message: '获取失败',
                error
            }
        }
    })

    // 新增文章标签
    fastify.post('/', {
        schema: {
            body: addTagBodySchema,
            response: {
                200: postTagResponseSchema
            }
        }
    }, async function (request, reply) {
        const { tag } = request.body
        if (!tag) {
            return {
                code: 400,
                data: {
                    _id: new ObjectId(),
                    tag: ''
                },
                message: '标签不能为空',
                error: '标签不能为空'
            }
        }
        try {
            const result = await tagCollection.insertOne({ tag })
            return {
                code: 200,
                data: {
                    _id: result.insertedId,
                    tag
                },
                message: '添加成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: {
                    _id: new ObjectId(),
                    tag
                },
                message: '服务器错误,添加失败',
                error
            }
        }
    })

    // 修改文章标签
    fastify.put('/', {
        schema: {
            body: updateTagBodySchema,
            response: {
                200: putTagResponseSchema,
            }
        }
    }, async function (request, reply) {
        const { id, tag } = request.body
        if (!id || !tag) {
            return {
                code: 400,
                data: {
                    _id: new ObjectId(id),
                    tag
                },
                message: '参数不完整',
                error: '参数不完整'
            }
        }
        try {
            const result = await db.collection('tag').updateOne(
                { _id: new ObjectId(id) },
                { $set: { tag } }
            )
            if (result.modifiedCount === 1) {
                return {
                    code: 200,
                    data: {
                        _id: new ObjectId(id),
                        tag
                    },
                    message: '修改成功'
                }
            } else {
                return {
                    code: 404,
                    data: {
                        _id: new ObjectId(id),
                        tag
                    },
                    message: '未找到标签或未修改',
                    error: '未找到标签或未修改'
                }
            }
        } catch (error) {
            return {
                code: 500,
                data: {
                    _id: new ObjectId(id),
                    tag
                },
                message: '修改失败',
                error
            }
        }
    })

    // 删除文章标签
    fastify.delete('/', {
        schema: {
            body: deleteTagBodySchema,
            response: {
                200: deleteTagResponseSchema
            }
        }
    }, async function (request, reply) {
        const { id } = request.body
        if (!id) {
            return {
                code: 400,
                data: { _id: new ObjectId(id) },
                message: '缺少 id'
            }
        }
        try {
            const result = await db.collection('tag').deleteOne({ _id: new ObjectId(id) })
            if (result.deletedCount === 1) {
                return {
                    code: 200,
                    data: {
                        _id: new ObjectId(id)
                    },
                    message: '删除成功'
                }
            } else {
                return {
                    code: 404,
                    data: {
                        _id: new ObjectId(id)
                    },
                    message: '未找到标签'
                }
            }
        } catch (error) {
            return {
                code: 500,
                data: {
                    _id: new ObjectId(id)
                },
                message: '删除失败',
                error
            }
        }
    })
}

export default tag
