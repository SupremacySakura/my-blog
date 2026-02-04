import { ObjectId, Db } from 'mongodb'
import { AppPluginAsync } from '../../../../types'

const label: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()

  // Helper function
  async function getOrCreateColorId(db: Db, colorValue: string): Promise<string> {
    const colorCol = db.collection("color")
    const exist = await colorCol.findOne({ color: colorValue })
    if (exist) return exist._id.toString()

    const insertRes = await colorCol.insertOne({
        color: colorValue,
        comment: ""
    })
    return insertRes.insertedId.toString()
  }

  // GET / - Get all labels
  fastify.get('/', async function (request, reply) {
    try {
        const label = await db.collection("label").aggregate([
            // 将字符串 color_id / bc_id 转为 ObjectId
            {
                $addFields: {
                    color_id_obj: { $toObjectId: "$color_id" },
                    bc_id_obj: { $toObjectId: "$bc_id" }
                }
            },
            // 关联 color_id
            {
                $lookup: {
                    from: "color",
                    localField: "color_id_obj",
                    foreignField: "_id",
                    as: "color_info"
                }
            },
            // 关联 bc_id
            {
                $lookup: {
                    from: "color",
                    localField: "bc_id_obj",
                    foreignField: "_id",
                    as: "bg_info"
                }
            },
            // 投影需要的字段
            {
                $project: {
                    _id: 1,
                    text: 1,
                    color: { $arrayElemAt: ["$color_info.color", 0] },
                    backgroundColor: { $arrayElemAt: ["$bg_info.color", 0] }
                }
            }
        ]).toArray()
        
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

  // POST / - Add label
  fastify.post('/', async function (request, reply) {
    try {
        const body = request.body as any
        const { text, color, backgroundColor } = body

        if (!text || !color || !backgroundColor) {
            return { code: 400, message: "缺少必填字段" }
        }

        const color_id = await getOrCreateColorId(db, color)
        const bc_id = await getOrCreateColorId(db, backgroundColor)

        await db.collection("label").insertOne({
            text,
            color_id,
            bc_id
        })

        return { code: 200, message: "添加成功" }
    } catch (error) {
        return {
            code: 500,
            message: "添加失败",
            error
        }
    }
  })

  // PUT / - Update label
  fastify.put('/', async function (request, reply) {
    try {
        const body = request.body as any
        const { id, text, color, backgroundColor } = body

        if (!id) return { code: 1, message: "缺少标签 id" }

        const color_id = await getOrCreateColorId(db, color)
        const bc_id = await getOrCreateColorId(db, backgroundColor)

        await db.collection("label").updateOne(
            { _id: new ObjectId(id) },
            { $set: { text, color_id, bc_id } }
        )

        return { code: 200, message: "修改成功" }
    } catch (error) {
        return {
            code: 500,
            message: "修改失败",
            error
        }
    }
  })

  // DELETE / - Delete label
  fastify.delete('/', async function (request, reply) {
    try {
        const body = request.body as any
        const { id } = body

        if (!id) return { code: 400, message: "缺少标签 id" }

        await db.collection("label").deleteOne({ _id: new ObjectId(id) })

        return { code: 200, message: "删除成功" }
    } catch (error) {
        return {
            code: 500,
            message: "删除失败",
            error
        }
    }
  })
}

export default label
