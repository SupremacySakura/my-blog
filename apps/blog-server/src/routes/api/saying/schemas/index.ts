import { ObjectId } from "mongodb"
import { z } from "zod/v4"
import { createResponseSchema } from "../../../../schemas/response"

export const sayingDataSchema = z.object({
    _id: z.instanceof(ObjectId).optional().describe('唯一标识'),
    text: z.string().describe('名言内容'),
})

export const getSayingResponseSchema = createResponseSchema(z.array(sayingDataSchema).describe('名言列表'))

export const postSayingBodySchema = z.object({
    text: z.string().describe('名言内容')
})

export const postSayingResponseSchema = createResponseSchema(z.undefined())

export const putSayingBodySchema = z.object({
    id: z.string().describe('唯一标识'),
    text: z.string().describe('名言内容')
})

export const putSayingResponseSchema = createResponseSchema(z.undefined())

export const deleteSayingBodySchema = z.object({
    id: z.string().describe('唯一标识')
})

export const deleteSayingResponseSchema = createResponseSchema(z.undefined())
