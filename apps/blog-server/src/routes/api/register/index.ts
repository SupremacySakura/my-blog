import { AppPluginAsync } from '../../../types'
import { verificationCodes } from './store'
import { registerBodySchema, registerResponseSchema } from './schemas'
import { User } from '../user/types'

const register: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()

    // 注册
    fastify.post('/', {
        schema: {
            body: registerBodySchema,
            response: {
                200: registerResponseSchema
            }
        }
    }, async function (request, reply) {
        const { username, password, email, code } = request.body

        if (!verificationCodes.has(email)) {
            return {
                code: 400,
                message: '验证码已过期',
                data: void 0
            }
        }
        const verificationCode = verificationCodes.get(email)!
        if (Date.now() - verificationCode.expires > 10 * 60 * 1000) {
            verificationCodes.delete(email)
            return {
                code: 400,
                message: '验证码已过期',
                data: void 0
            }
        }
        if (verificationCode.code !== code) {
            return {
                code: 400,
                message: '验证码错误',
                data: void 0
            }
        }

        try {
            const userCol = db.collection<User>('user')
            const result = await userCol.findOne({ username })
            if (result) {
                return {
                    code: 400,
                    message: '用户已存在',
                    data: void 0
                }
            }
            await userCol.insertOne({ username, password, email } as any)
            return {
                code: 200,
                message: '注册成功',
                data: void 0,
            }
        } catch (error) {
            return {
                code: 500,
                message: '服务器错误',
                data: void 0,
                error
            }
        }
    })
}

export default register
