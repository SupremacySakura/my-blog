import { ObjectId } from "mongodb"
import { z } from "zod/v4"
import { createResponseSchema } from "../../../../schemas/response"
import { userDataSchema } from "../../user/schemas"

export const messageDataSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识'),
    content: z.string().describe('留言内容'),
    time: z.string().describe('时间'),
    user_id: z.instanceof(ObjectId).describe('用户ID'),
})

// Extended schema for GET response which includes user info
export const messageWithUserSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识'),
    content: z.string().describe('留言内容'),
    time: z.string().or(z.date()).describe('时间'),
    user_id: z.instanceof(ObjectId).describe('用户ID'),
    user: userDataSchema,
})

export const getMessageListQuerySchema = z.object({
    page: z.string().optional().describe('页码'),
    pageSize: z.string().optional().describe('每页数量')
})

export const getMessageListResponseSchema = createResponseSchema(z.array(messageWithUserSchema))

export const postMessageBodySchema = z.object({
    content: z.string().describe('留言内容')
})

export const postMessageResponseSchema = createResponseSchema(z.undefined())

export const deleteMessageBodySchema = z.object({
    id: z.string().describe('留言ID')
})

export const deleteMessageResponseSchema = createResponseSchema(z.undefined())

export const getMessageCountResponseSchema = createResponseSchema(z.number().describe('留言数量'))