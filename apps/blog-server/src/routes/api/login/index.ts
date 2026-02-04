import { z } from 'zod/v4'
import { AppPluginAsync } from '../../../types'

const loginBodySchema = z.object({
    username: z.string(),
    password: z.string(),
    loginType: z.enum(['owner', 'user'])
})

const login: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // POST / - Login
    fastify.post('/', {
        schema: {
            body: loginBodySchema
        }
    }, async function (request, reply) {
        try {
            const body = request.body
            const { username, password, loginType } = body

            // 查找用户
            const result = await db.collection('user').findOne({ username })
            if (!result) {
                return { code: 400, message: '用户不存在' }
            }

            // 验证密码
            if (result.password !== password) {
                return { code: 400, message: '密码错误' }
            }

            // 生成 token
            const payload = {
                uid: result._id.toString(),
                username: result.username,
            }
            const accessToken = fastify.signAccess(payload)
            const refreshToken = fastify.signRefresh(payload)

            // 设置响应头
            reply.header('Authorization', `Bearer ${accessToken}`)
            reply.header('refreshToken', refreshToken)

            // 验证用户类型
            if (result.role === 'owner' && loginType === 'owner') {
                const ownerToken = fastify.signOwner(payload)
                reply.header('ownerToken', ownerToken)
            }

            return {
                code: 200,
                message: '登录成功',
                data: {
                    ...result,
                    password: undefined, // 不返回密码
                },
            }
        } catch (error) {
            return { code: 400, message: '服务器错误', error }
        }
    })
}

export default login
