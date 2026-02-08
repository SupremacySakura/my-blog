import { ObjectId } from "mongodb"
import { z } from 'zod/v4'
import { createResponseSchema } from "../../../../schemas/response"
import { userDataSchema } from "../../user/schemas"

export const articleDataSchema = z.object({
    _id: z.instanceof(ObjectId).optional().describe('唯一标识'),
    head: z.string().describe('标题'),
    digest: z.string().describe('概要'),
    article: z.string().describe('文章飞书链接'),
    cover: z.string().describe('封面图片链接'),
    time: z.date().describe('发布时间'),
    user_id: z.instanceof(ObjectId).describe('发布人用户唯一标识'),
    tag: z.array(z.instanceof(ObjectId).describe('标签唯一标识')).describe('标签标识数组'),
    visit: z.number().describe('观看人数')
})

export const tagDataSchema = z.object({
    _id: z.instanceof(ObjectId).optional().describe('唯一标识'),
    tag: z.string().describe('标签名')
})

export const fullArticleDataSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识'),
    head: z.string().describe('标题'),
    digest: z.string().describe('概要'),
    article: z.string().describe('文章飞书链接'),
    cover: z.string().describe('封面图片链接'),
    time: z.date().describe('发布时间'),
    user: userDataSchema,
    tags: z.array(tagDataSchema).describe('标签标识数组'),
    visit: z.number().describe('观看人数')
})

const articleCountSchema = z.number().describe('文章数量')

export const getArticleCountResponseSchema = createResponseSchema(articleCountSchema)

export const addTagBodySchema = z.object({
    tag: z.string().describe('标签名')
})

export const updateTagBodySchema = z.object({
    id: z.string().describe('唯一标识'),
    tag: z.string().describe('标签名')
})

export const deleteTagBodySchema = z.object({
    id: z.string().describe('唯一标识')
})

const tagArrayDataSchema = z.array(tagDataSchema)

export const getTagResponseSchema = createResponseSchema(tagArrayDataSchema)

export const postTagResponseSchema = createResponseSchema(tagDataSchema)

export const putTagResponseSchema = createResponseSchema(tagDataSchema)

const deleteTagDataSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识')
})
export const deleteTagResponseSchema = createResponseSchema(deleteTagDataSchema)

export const getArticleUrlResponseSchema = createResponseSchema(articleDataSchema)

export const getArticleUrlQuerySchema = z.object({
    id: z.string().describe('唯一标识')
})

export const postArticleVisitBodySchema = z.object({
    id: z.string().describe('唯一标识')
})

export const postArticleVisitResponseSchema = createResponseSchema(z.undefined())

export const getArticleListQuerySchema = z.object({
    page: z.string().optional().describe('页码'),
    pageSize: z.string().optional().describe('每页大小')
})

export const getArticleListResponseSchema = createResponseSchema(z.array(fullArticleDataSchema))

export const postArticleBodySchema = z.object({
    head: z.string().describe('标题'),
    digest: z.string().describe('概要'),
    article: z.string().describe('文章飞书链接'),
    cover: z.string().describe('封面图片链接'),
    user_id: z.string().describe('发布人用户唯一标识'),
    tag: z.array(z.string().describe('标签唯一标识')).describe('标签标识数组')
})

export const postArticleResponseSchema = createResponseSchema(z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识')
}))

export const updateArticleBodySchema = z.object({
    id: z.string().describe('文章唯一标识'),
    head: z.string().describe('标题'),
    digest: z.string().describe('概要'),
    article: z.string().describe('文章飞书链接'),
    cover: z.string().describe('封面图片链接'),
    user_id: z.string().describe('发布人用户唯一标识'),
    tag: z.array(z.string().describe('标签唯一标识')).describe('标签标识数组')
})

export const updateArticleResponseSchema = createResponseSchema(z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识')
}))

export const deleteArticleBodySchema = z.object({
    id: z.string().describe('唯一标识')
})

export const deleteArticleResponseSchema = createResponseSchema(z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识')
}))