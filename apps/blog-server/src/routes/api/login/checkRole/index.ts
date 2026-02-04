import { AppPluginAsync } from "../../../../types"


const checkRole: AppPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', async function (request, reply) {
    if (!fastify.verifyOwner(request, reply)) {
      return
    }

    return {
      code: 200,
      message: 'success',
      data: {
        role: 'owner'
      }
    }
  })
}

export default checkRole
