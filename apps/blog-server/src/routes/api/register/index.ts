import { AppPluginAsync } from '../../../types'
import { verificationCodes } from './store'

const register: AppPluginAsync = async (fastify, opts): Promise<void> => {
  const db = fastify.mongo.db()

  fastify.post('/', async function (request, reply) {
    const body = request.body as any
    const { username, password, email, code } = body

    if (!verificationCodes.has(email)) {
        return {
            code: 400,
            message: '验证码已过期',
        }
    }
    const verificationCode = verificationCodes.get(email)!
    if (Date.now() - verificationCode.expires > 10 * 60 * 1000) {
        verificationCodes.delete(email)
        return {
            code: 400,
            message: '验证码已过期',
        }
    }
    if (verificationCode.code !== code) {
        return {
            code: 400,
            message: '验证码错误',
        }
    }

    try {
        const userCol = db.collection('user')
        const result = await userCol.findOne({ username })
        if (result) {
            return {
                code: 400,
                message: '用户已存在',
            }
        }
        const insertRes = await userCol.insertOne({ username, password, email })
        return {
            code: 200,
            message: '注册成功',
            data: insertRes,
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

export default register
