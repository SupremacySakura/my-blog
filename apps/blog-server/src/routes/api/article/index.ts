import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../types'
import { Article, fullArticle, Tag } from './types'
import { User } from '../user/types'
import { deleteArticleBodySchema, deleteArticleResponseSchema, getArticleListQuerySchema, getArticleListResponseSchema, postArticleBodySchema, postArticleResponseSchema, updateArticleBodySchema, updateArticleResponseSchema } from './schemas'
const article: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // Helper for GET pagination
    const getArticles = async (page = 1, pageSize = 4): Promise<fullArticle[]> => {
        const skip = (page - 1) * pageSize

        // 1. Get articles
        const articles = await db.collection<Article>("article")
            .find({})
            .sort({ time: -1 })
            .skip(skip)
            .limit(pageSize)
            .toArray()

        if (articles.length === 0) {
            return []
        }

        // 2. Collect IDs
        const tagIds = articles.flatMap(a => a.tag || [])
        const userIds = articles.map(a => a.user_id).filter(Boolean)

        // 3. Fetch relations
        const [tags, users] = await Promise.all([
            tagIds.length
                ? db.collection<Tag>("tag").find({ _id: { $in: tagIds } }).toArray()
                : [],
            userIds.length
                ? db.collection<User>("user").find({ _id: { $in: userIds } }).toArray()
                : []
        ])

        // 4. Build maps
        const tagMap = new Map(tags.map(t => [t._id.toString(), t]))
        const userMap = new Map(users.map(u => [u._id.toString(), u]))

        // 5. Build result
        const result = articles.map(a => ({
            _id: a._id,
            head: a.head,
            digest: a.digest,
            article: a.article,
            cover: a.cover || '',
            time: a.time,
            visit: a.visit || 0,
            tags: (a.tag || []).map((tid: ObjectId) => {
                const tag = tagMap.get(tid.toString())
                return tag ? { _id: tag._id, tag: tag.tag } : {} as Tag
            }).filter(Boolean),
            user: userMap.get(a.user_id?.toString()) || {} as User
        }))
        return result
    }

    // 获取文章列表
    fastify.get('/', {
        schema: {
            querystring: getArticleListQuerySchema,
            response: {
                200: getArticleListResponseSchema
            }
        }
    }, async function (request, reply) {
        const { page, pageSize } = request.query
        const pageNum = Number(page) || 1
        const pageSizeNum = Number(pageSize) || 4

        try {
            const data = await getArticles(pageNum, pageSizeNum)
            return {
                code: 200,
                data,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: {} as fullArticle[],
                message: '获取失败',
                error: (error as Error).message
            }
        }
    })

    // 新增文章
    fastify.post('/', {
        schema: {
            body: postArticleBodySchema,
            response: {
                200: postArticleResponseSchema
            }
        }
    }, async function (request, reply) {
        const body = request.body
        const { head, digest, article, cover, user_id, tag } = body

        if (!head || !digest || !article || !user_id) {
            return {
                code: 400,
                data: {
                    _id: new ObjectId()
                },
                message: '参数不完整'
            }
        }
        const tagIds = (tag || []).map((id: string) => new ObjectId(id))
        try {
            const result = await db.collection<Article>('article').insertOne({
                head,
                digest,
                article,
                cover: cover || '',
                user_id: new ObjectId(user_id),
                tag: tagIds,
                time: new Date(),
                visit: 0
            })

            return {
                code: 200,
                data: {
                    _id: result.insertedId
                }, message: '添加成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: {
                    _id: new ObjectId()
                },
                message: '添加失败',
                error
            }
        }
    })

    // 更新文章
    fastify.put('/', {
        schema: {
            body: updateArticleBodySchema,
            response: {
                200: updateArticleResponseSchema
            }
        }
    }, async function (request, reply) {
        const body = request.body
        const { id, head, digest, article, cover, user_id, tag } = body

        if (!id || !head || !digest || !article || !user_id) {
            return {
                code: 400,
                data: {
                    _id: new ObjectId()
                },
                message: '参数不完整'
            }
        }
        try {
            const tagIds = (tag || []).map((id: string) => new ObjectId(id))

            const result = await db.collection('article').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        head,
                        digest,
                        article,
                        cover: cover || '',
                        user_id,
                        tag: tagIds
                    }
                }
            )

            if (result.modifiedCount === 1) {
                return {
                    code: 200,
                    data: {
                        _id: new ObjectId(id)
                    },
                    message: '修改成功'
                }
            } else {
                return {
                    code: 404,
                    data: {
                        _id: new ObjectId()
                    },
                    message: '未找到文章或未修改'
                }
            }
        } catch (error) {
            return {
                code: 500,
                data: {
                    _id: new ObjectId()
                },
                message: '修改失败',
                error: (error as Error).message
            }
        }
    })

    // 删除文章
    fastify.delete('/', {
        schema: {
            body: deleteArticleBodySchema,
            response: {
                200: deleteArticleResponseSchema
            }
        }
    }, async function (request, reply) {
        const body = request.body
        const { id } = body
        if (!id) {
            return {
                code: 400,
                data: {
                    _id: new ObjectId()
                },
                message: '缺少 id'
            }
        }
        try {
            const result = await db.collection('article').deleteOne({ _id: new ObjectId(id) })

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
                        _id: new ObjectId()
                    },
                    message: '未找到文章'
                }
            }
        } catch (error) {
            return {
                code: 500,
                data: {
                    _id: new ObjectId()
                },
                message: '删除失败',
                error: (error as Error).message
            }
        }
    })
}

export default article
