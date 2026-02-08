import { AppPluginAsync } from '../../../types'
import { getAddressResponseSchema } from './schemas'
import { Address } from './types'

const address: AppPluginAsync = async (fastify, opts): Promise<void> => {

    // 获取地址
    fastify.get('/', {
        schema: {
            response: {
                200: getAddressResponseSchema
            }
        }
    }, async function (request, reply) {
        try {
            const db = fastify.mongo.db()
            const addressCollection = db.collection<Address>('address')
            const address = await addressCollection.find().toArray()
            return {
                code: 200,
                data: address,
                message: '获取成功'
            }
        } catch (error) {
            return {
                code: 500,
                data: [],
                message: '服务器错误,获取失败',
                error
            }
        }
    })
}

export default address

