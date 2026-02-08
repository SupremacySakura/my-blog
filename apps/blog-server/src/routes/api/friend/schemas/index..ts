import { ObjectId } from "mongodb"
import { z } from "zod/v4"
import { createResponseSchema } from "../../../../schemas/response"
import { userDataSchema } from "../../user/schemas"

export const noticeDataSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识'),
    notice: z.string().describe('公共内容')
})

export const getNoticeListResponseSchema = createResponseSchema(z.array(noticeDataSchema))

export const friendDataSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识'),
    name: z.string().describe('博客名'),
    label: z.string().describe('标签'),
    url: z.string().describe('博客网址'),
    status: z.number().describe('状态'),
    user: userDataSchema,
})

export const getFriendListQuerySchema = z.object({
    needAll: z.string().optional().describe('是否选择所有')
})

export const getFriendListResponseSchema = createResponseSchema(z.array(friendDataSchema))

export const postFriendBodySchema = z.object({
    name: z.string().describe('博客名'),
    label: z.string().describe('标签'),
    url: z.string().describe('博客网址')
})

export const postFriendResponseSchema = createResponseSchema(z.object({
    success: z.boolean().describe('是否提交成功')
}))

export const deleteFriendBodySchema = z.object({
    id: z.string().describe('唯一标识')
})

export const deleteFriendResponseSchema = createResponseSchema(z.undefined())

export const updateFriendBodySchema = z.object({
    id: z.string().describe('唯一id'),
    status: z.number().describe('状态')
})

export const updateFriendResponseSchema = createResponseSchema(z.undefined())