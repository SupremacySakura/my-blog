import { ObjectId } from "mongodb"
import { z } from "zod/v4"
import { createResponseSchema } from "../../../../schemas/response"

// 地址数据 schama
export const addressDataSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识'),
    text: z.string().describe('联系地址名称'),
    url: z.string().describe('联系地址网址'),
    icon: z.string().describe('联系地址图标'),
})

// 获取地址响应data schema
const addressArrayDataSchema = z.array(addressDataSchema).describe('联系地址列表')

// 获取地址响应数据 schema
export const getAddressResponseSchema = createResponseSchema(addressArrayDataSchema)
