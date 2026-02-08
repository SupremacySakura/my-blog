import { z } from "zod/v4"
import { createResponseSchema } from "../../../../schemas/response"

// Register Schemas
export const registerBodySchema = z.object({
    username: z.string().describe('用户名'),
    password: z.string().describe('密码'),
    email: z.email().describe('邮箱'),
    code: z.string().length(6).describe('验证码')
})

export const registerResponseSchema = createResponseSchema(z.undefined())

// Verify Schemas
export const verifyBodySchema = z.object({
    email: z.email().describe('邮箱')
})

export const verifyResponseSchema = createResponseSchema(z.undefined())
