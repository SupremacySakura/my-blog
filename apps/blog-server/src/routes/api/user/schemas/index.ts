import { ObjectId } from "mongodb"
import { z } from 'zod/v4'
import { createResponseSchema } from "../../../../schemas/response"

export const userDataSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识'),
    username: z.string().describe('用户名'),
    password: z.string().optional().describe('用户密码'),
    email: z.email().describe('用户邮箱'),
    role: z.enum(['user', 'owner']).optional().describe('用户权限'),
    address: z.string().optional().describe('用户地址'),
    avatar: z.string().describe('用户头像')
})

export const getOwnerSchema = createResponseSchema(userDataSchema)