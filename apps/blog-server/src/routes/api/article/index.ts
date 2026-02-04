import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../types'

const article: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // Helper for GET pagination
    const getArticles = async (page = 1, pageSize = 4) => {
        const skip = (page - 1) * pageSize

        // 1. Get articles
        const articles = await db.collection("article")
            .find({})
            .sort({ time: -1 })
            .skip(skip)
            .limit(pageSize)
            .toArray()

        if (articles.length === 0) return []

        // 2. Collect IDs
        const tagIds = articles.flatMap(a => a.tag || [])
        const userIds = articles.map(a => a.user_id).filter(Boolean)

        // 3. Fetch relations
        const [tags, users] = await Promise.all([
            tagIds.length
                ? db.collection("tag").find({ _id: { $in: tagIds } }).toArray()
                : [],
            userIds.length
                ? db.collection("user").find({ _id: { $in: userIds } }).toArray()
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
                return tag ? { _id: tag._id, tag: tag.tag } : null
            }).filter(Boolean),
            user: userMap.get(a.user_id?.toString()) || null
        }))
        return result
    }

    // GET / - Get articles list
    fastify.get('/', async function (request, reply) {
        try {
            const { page, pageSize } = request.query as { page?: string, pageSize?: string }
            const pageNum = Number(page) || 1
            const pageSizeNum = Number(pageSize) || 4

            const data = await getArticles(pageNum, pageSizeNum)
            return { code: 200, data, message: '获取成功' }
        } catch (error) {
            return { code: 500, message: '获取失败', error: (error as Error).message }
        }
    })

    // POST / - Create article
    fastify.post('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { head, digest, article, cover, user_id, tags } = body

            if (!head || !digest || !article || !user_id) {
                return { code: 400, message: '参数不完整' }
            }

            const tagIds = (tags || []).map((id: string) => new ObjectId(id))

            const result = await db.collection('article').insertOne({
                head,
                digest,
                article,
                cover: cover || '',
                user_id,
                tag: tagIds,
                time: new Date(),
                visit: 0
            })

            return { code: 200, data: { _id: result.insertedId }, message: '添加成功' }
        } catch (error) {
            return { code: 500, message: '添加失败', error }
        }
    })

    // PUT / - Update article
    fastify.put('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { id, head, digest, article, cover, user_id, tags } = body

            if (!id || !head || !digest || !article || !user_id) {
                return { code: 400, message: '参数不完整' }
            }

            const tagIds = (tags || []).map((id: string) => new ObjectId(id))

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
                return { code: 200, data: { _id: id }, message: '修改成功' }
            } else {
                return { code: 404, message: '未找到文章或未修改' }
            }
        } catch (error) {
            return { code: 500, message: '修改失败', error: (error as Error).message }
        }
    })

    // DELETE / - Delete article
    fastify.delete('/', async function (request, reply) {
        try {
            const body = request.body as any
            const { id } = body
            if (!id) return { code: 400, message: '缺少 id' }

            const result = await db.collection('article').deleteOne({ _id: new ObjectId(id) })

            if (result.deletedCount === 1) {
                return { code: 200, data: { _id: id }, message: '删除成功' }
            } else {
                return { code: 404, message: '未找到文章' }
            }
        } catch (error) {
            return { code: 500, message: '删除失败', error: (error as Error).message }
        }
    })
}

export default article
