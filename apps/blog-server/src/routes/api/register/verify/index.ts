import { AppPluginAsync } from '../../../../types'
import { verificationCodes } from '../store'
import { verifyBodySchema, verifyResponseSchema } from '../schemas'

const verify: AppPluginAsync = async (fastify, opts): Promise<void> => {

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
      const code = Math.floor(100000 + Math.random() * 900000).toString()

      await fastify.sendVerificationEmail(email, code)
      verificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 })

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
