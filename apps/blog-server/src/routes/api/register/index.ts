import { AppPluginAsync } from '../../../types'
import { registerBodySchema, registerResponseSchema } from './schemas'
import { User } from '../user/types'

const register: AppPluginAsync = async (fastify, opts): Promise<void> => {
    const db = fastify.mongo.db()
    const verificationCodeCol = db.collection<{
        email: string
        code: string
        expiresAt: Date
        createdAt: Date
    }>('verification_code')

    await verificationCodeCol.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
    await verificationCodeCol.createIndex({ email: 1 }, { unique: true })

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
        const normalizedEmail = email.trim().toLowerCase()

        const verificationCode = await verificationCodeCol.findOne({ email: normalizedEmail })
        if (!verificationCode) {
            return {
                code: 400,
                message: '验证码已过期',
                data: void 0
            }
        }
        if (Date.now() > verificationCode.expiresAt.getTime()) {
            await verificationCodeCol.deleteOne({ email: normalizedEmail })
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
        await verificationCodeCol.deleteOne({ email: normalizedEmail })

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
            await userCol.insertOne({ username, password, email: normalizedEmail } as any)
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
