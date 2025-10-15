import clientPromise from "@/lib/mongodb"
import { Db, ObjectId } from "mongodb"
import { NextResponse } from "next/server"

/**
 * POST - 新增文章
 * body: { head, digest, article, cover, user_id, tags: string[] }  // tags 为标签 _id 数组
 * @param request 
 * @returns 文章 _id
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { head, digest, article, cover, user_id, tags } = body

        if (!head || !digest || !article || !user_id) {
            return NextResponse.json({ code: 400, message: '参数不完整' })
        }

        const client = await clientPromise
        const db = client.db('MyBlog')

        // tags 直接存 ObjectId 数组
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

        return NextResponse.json({ code: 200, data: { _id: result.insertedId }, message: '添加成功' })
    } catch (error) {
        return NextResponse.json({ code: 500, message: '添加失败', error })
    }
}

/**
 * PUT - 编辑文章
 * body: { id, head, digest, article, cover, user_id, tags: string[] }
 * @param request 
 * @returns 文章 _id
 */
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, head, digest, article, cover, user_id, tags } = body

        if (!id || !head || !digest || !article || !user_id) {
            return NextResponse.json({ code: 400, message: '参数不完整' })
        }

        const client = await clientPromise
        const db = client.db('MyBlog')

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
            return NextResponse.json({ code: 200, data: { _id: id }, message: '修改成功' })
        } else {
            return NextResponse.json({ code: 404, message: '未找到文章或未修改' })
        }
    } catch (error) {

        return NextResponse.json({ code: 500, message: '修改失败', error: (error as Error).message })
    }
}

/**
 * DELETE - 删除文章
 * body: { id }
 * @param request 
 * @returns 文章 _id
 */
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()
        if (!id) return NextResponse.json({ code: 400, message: '缺少 id' })

        const client = await clientPromise
        const db = client.db('MyBlog')
        const result = await db.collection('article').deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 1) {
            return NextResponse.json({ code: 200, data: { _id: id }, message: '删除成功' })
        } else {
            return NextResponse.json({ code: 404, message: '未找到文章' })
        }
    } catch (error) {
        return NextResponse.json({ code: 500, message: '删除失败', error: (error as Error).message })
    }
}

/**
 * GET - 获取文章（分页）
 * 支持 tags 展示完整标签对象
 * @param request 
 * @returns 文章列表
 */
const getArticles = async (db: Db, page = 1, pageSize = 4) => {
    const skip = (page - 1) * pageSize

    // 1️⃣ 获取文章列表（分页 + 时间倒序）
    const articles = await db.collection("article")
        .find({})
        .sort({ time: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray()
    // 没有文章时直接返回空数组
    if (articles.length === 0) return []
    // 2️⃣ 收集所有需要查找的 tag 和 user id
    const tagIds = articles.flatMap(a => a.tag || [])
    const userIds = articles.map(a => a.user_id).filter(Boolean)
    // 3️⃣ 一次性查出所有关联的标签和用户
    const [tags, users] = await Promise.all([
        tagIds.length
            ? db.collection("tag").find({ _id: { $in: tagIds } }).toArray()
            : [],
        userIds.length
            ? db.collection("user").find({ _id: { $in: userIds } }).toArray()
            : []
    ])
    // 4️⃣ 构建用户和标签的映射表，加快匹配
    const tagMap = new Map(tags.map(t => [t._id.toString(), t]))
    const userMap = new Map(users.map(u => [u._id.toString(), u]))

    // 5️⃣ 拼装结果
    const result = articles.map(a => ({
        _id: a._id,
        head: a.head,
        digest: a.digest,
        article: a.article,
        cover: a.cover || '',
        time: a.time,
        visit: a.visit || 0,
        // 找不到标签时返回空数组
        tags: (a.tag || []).map((tid: ObjectId) => {
            const tag = tagMap.get(tid.toString())
            return tag ? { _id: tag._id, tag: tag.tag } : null
        }).filter(Boolean),
        // 找不到用户时返回 null
        user: userMap.get(a.user_id?.toString()) || null
    }))
    return result
}
/**
 * GET - 获取文章列表
 * @param request 
 * @returns 文章列表
 */
export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page')) || 1
        const pageSize = Number(url.searchParams.get('pageSize')) || 4
        const client = await clientPromise
        const db = client.db('MyBlog')
        const data = await getArticles(db, page, pageSize)
        return NextResponse.json({ code: 200, data, message: '获取成功' })
    } catch (error) {
        return NextResponse.json({ code: 500, message: '获取失败', error: (error as Error).message })
    }
}
