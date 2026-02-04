import { AppPluginAsync } from '../../../../types'
import { verificationCodes } from '../store'

const verify: AppPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', async function (request, reply) {
    try {
      const body = request.body as { email: string }
      const { email } = body
      const code = Math.floor(100000 + Math.random() * 900000).toString()

      await fastify.sendVerificationEmail(email, code)
      verificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 })

      return { message: '验证码已发送', code: 200 }
    } catch (error) {
      return { message: '发送失败', error, code: 500 }
    }
  })
}

export default verify
