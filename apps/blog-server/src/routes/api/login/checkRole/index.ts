import { AppPluginAsync } from "../../../../types"
import { checkRoleResponseSchema } from "../schemas"


const checkRole: AppPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', {
    schema: {
        response: {
            200: checkRoleResponseSchema
        }
    }
  }, async function (request, reply) {
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
