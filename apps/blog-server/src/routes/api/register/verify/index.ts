import { AppPluginAsync } from '../../../../types'
import { verifyBodySchema, verifyResponseSchema } from '../schemas'

const verify: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()
  const verificationCodeCol = db.collection<{
    email: string
    code: string
    expiresAt: Date
    createdAt: Date
  }>('verification_code')

  await verificationCodeCol.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
  await verificationCodeCol.createIndex({ email: 1 }, { unique: true })

  // 验证邮箱
  fastify.post('/', {
    schema: {
      body: verifyBodySchema,
      response: {
        200: verifyResponseSchema
      }
    }
  }, async function (request, reply) {
    try {
      const { email } = request.body
      const normalizedEmail = email.trim().toLowerCase()
      const code = Math.floor(100000 + Math.random() * 900000).toString()

      await fastify.sendVerificationEmail(normalizedEmail, code)
      await verificationCodeCol.updateOne(
        { email: normalizedEmail },
        {
          $set: {
            code,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            createdAt: new Date()
          }
        },
        { upsert: true }
      )
      return {
        message: '验证码已发送',
        data: void 0,
        code: 200
      }
    } catch (error) {
      return {
        message: '发送失败',
        data: void 0,
        error,
        code: 500
      }
    }
  })
}

export default verify
