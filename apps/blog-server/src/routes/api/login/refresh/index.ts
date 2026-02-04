import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'

const refresh: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()

  fastify.post('/', async function (request, reply) {
    if (!fastify.verifyRefresh(request, reply)) {
        return
    }

    const refreshUser = (request as any).refreshUser
    const uid = refreshUser.uid || refreshUser.userId || refreshUser._id

    try {
        const result = await db.collection('user').findOne({ _id: new ObjectId(uid as string) })
        
        if (!result) {
            return { code: 404, message: 'User not found' }
        }

        const newPayload = {
            uid: uid,
            username: refreshUser.username,
        }

        const accessToken = fastify.signAccess(newPayload)

        reply.header('Authorization', `Bearer ${accessToken}`)

        return {
            code: 200,
            message: '刷新成功',
            data: {
                ...result,
                password: '', // 清空密码
            },
        }
    } catch (error) {
        return {
            code: 500,
            message: '服务器错误',
            error
        }
    }
  })
}

export default refresh
