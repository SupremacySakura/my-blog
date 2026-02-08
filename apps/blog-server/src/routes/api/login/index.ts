import { AppPluginAsync } from '../../../types'
import { UserDB } from './types'
import { loginBodySchema, loginResponseSchema } from './schemas'

const login: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // 登录
    fastify.post('/', {
        schema: {
            body: loginBodySchema,
            response: {
                200: loginResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const { username, password, loginType } = request.body

            // 查找用户
            const result = await db.collection<UserDB>('user').findOne({ username })
            if (!result) {
                return {
                    code: 400,
                    message: '用户不存在',
                    data: null
                }
            }

            // 验证密码
            if (result.password !== password) {
                return {
                    code: 400,
                    message: '密码错误',
                    data: null
                }
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

            // 安全地移除密码字段
            const { password: _, ...userWithoutPassword } = result

            return {
                code: 200,
                message: '登录成功',
                data: userWithoutPassword,
            }
        } catch (error) {
            return {
                code: 400,
                message: '服务器错误',
                data: null,
                error
            }
        }
    })
}

export default login
