import { ObjectId } from "mongodb"
import { z } from "zod/v4"
import { createResponseSchema } from "../../../../schemas/response"

// --- Login Schemas ---
export const loginBodySchema = z.object({
    username: z.string().describe('用户名'),
    password: z.string().describe('密码'),
    loginType: z.enum(['owner', 'user']).describe('登录类型')
})

export const loginResponseDataSchema = z.object({
    _id: z.instanceof(ObjectId),
    username: z.string(),
    avatar: z.string().optional(),
    email: z.string().optional(),
    role: z.string().optional(),
    password: z.undefined().optional(), // 明确不返回密码
})

export const loginResponseSchema = createResponseSchema(loginResponseDataSchema.or(z.null()))

// --- CheckRole Schemas ---
export const checkRoleResponseSchema = createResponseSchema(z.object({
    role: z.string()
}).or(z.null()))

// --- Refresh Schemas ---
export const refreshResponseSchema = createResponseSchema(loginResponseDataSchema.or(z.null()))
