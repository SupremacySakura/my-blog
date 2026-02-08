import { ObjectId } from "mongodb"
import { z } from 'zod/v4'
import { createResponseSchema } from "../../../../schemas/response"

export const visitBodySchema = z.object({
    _id:z.instanceof(ObjectId).optional().describe('唯一标识'),
    device: z.string().describe('设备类型'),
    browser: z.string().describe('浏览器类型'),
    os: z.string().describe('操作系统'),
    timestamp: z.string().describe('日期')
})

export const visitResponseSchema = createResponseSchema(z.undefined())