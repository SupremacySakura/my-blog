import { ObjectId } from 'mongodb'
import { AppPluginAsync } from '../../../../types'
import { UserDB } from '../types'
import { refreshResponseSchema } from '../schemas'

const refresh: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()

  fastify.post('/', {
    schema: {
        response: {
            200: refreshResponseSchema
        }
    }
  }, async function (request, reply) {
    if (!fastify.verifyRefresh(request, reply)) {
        return
    }

    const refreshUser = (request as any).refreshUser
    const uid = refreshUser.uid || refreshUser.userId || refreshUser._id

    try {
        const result = await db.collection<UserDB>('user').findOne({ _id: new ObjectId(uid as string) })
        
        if (!result) {
            return { code: 404, message: 'User not found', data: null }
        }

        const newPayload = {
            uid: uid,
            username: refreshUser.username,
        }

        const accessToken = fastify.signAccess(newPayload)

        reply.header('Authorization', `Bearer ${accessToken}`)

        // 安全地移除密码字段
        const { password: _, ...userWithoutPassword } = result

        return {
            code: 200,
            message: '刷新成功',
            data: userWithoutPassword,
        }
    } catch (error) {
        return {
            code: 500,
            message: '服务器错误',
            data: null,
            error
        }
    }
  })
}

export default refresh
