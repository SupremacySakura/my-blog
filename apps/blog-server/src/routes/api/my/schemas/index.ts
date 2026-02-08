import { ObjectId } from "mongodb"
import { z } from "zod/v4"
import { createResponseSchema } from "../../../../schemas/response"

// --- Color Schemas ---
export const colorDataSchema = z.object({
    _id: z.instanceof(ObjectId).optional().describe('唯一标识'),
    color: z.string().describe('颜色值'),
    comment: z.string().describe('备注')
})

export const getColorListResponseSchema = createResponseSchema(z.array(colorDataSchema))

export const postColorBodySchema = z.object({
    color: z.string().describe('颜色值'),
    comment: z.string().optional().default("").describe('备注')
})

export const postColorResponseSchema = createResponseSchema(z.undefined())

export const putColorBodySchema = z.object({
    id: z.string().describe('唯一标识'),
    color: z.string().describe('颜色值'),
    comment: z.string().optional().default("").describe('备注')
})

export const putColorResponseSchema = createResponseSchema(z.undefined())

export const deleteColorBodySchema = z.object({
    id: z.string().describe('唯一标识')
})

export const deleteColorResponseSchema = createResponseSchema(z.undefined())

// --- Label Schemas ---
export const labelDataSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识'),
    text: z.string().describe('标签内容'),
    color: z.string().describe('字体颜色'),
    backgroundColor: z.string().describe('背景颜色')
})

export const getLabelListResponseSchema = createResponseSchema(z.array(labelDataSchema))

export const postLabelBodySchema = z.object({
    text: z.string().describe('标签内容'),
    color: z.string().describe('字体颜色'),
    backgroundColor: z.string().describe('背景颜色')
})

export const postLabelResponseSchema = createResponseSchema(z.undefined())

export const putLabelBodySchema = z.object({
    id: z.string().describe('唯一标识'),
    text: z.string().describe('标签内容'),
    color: z.string().describe('字体颜色'),
    backgroundColor: z.string().describe('背景颜色')
})

export const putLabelResponseSchema = createResponseSchema(z.undefined())

export const deleteLabelBodySchema = z.object({
    id: z.string().describe('唯一标识')
})

export const deleteLabelResponseSchema = createResponseSchema(z.undefined())

// --- Technology Schemas ---
export const technologyDataSchema = z.object({
    _id: z.instanceof(ObjectId).describe('唯一标识'),
    photo: z.string().optional().describe('图片'),
    text: z.string().describe('内容'),
    src: z.string().optional().describe('链接'),
    height: z.number().optional().describe('高度'),
    icon: z.string().optional().describe('图标'),
    note: z.string().optional().describe('备注')
})

export const getTechnologyListResponseSchema = createResponseSchema(z.array(technologyDataSchema))

export const postTechnologyBodySchema = z.object({
    photo: z.string().optional().describe('图片'),
    text: z.string().describe('内容'),
    src: z.string().optional().describe('链接'),
    height: z.number().optional().describe('高度'),
    icon: z.string().optional().describe('图标'),
    note: z.string().optional().describe('备注')
})

export const postTechnologyResponseSchema = createResponseSchema(z.undefined())
export const putTechnologyBodySchema = z.object({
    id: z.string().describe('唯一标识'),
    photo: z.string().optional().describe('图片'),
    text: z.string().describe('内容'),
    src: z.string().optional().describe('链接'),
    height: z.number().optional().describe('高度'),
    icon: z.string().optional().describe('图标'),
    note: z.string().optional().describe('备注')
})

export const putTechnologyResponseSchema = createResponseSchema(z.undefined())

export const deleteTechnologyBodySchema = z.object({
    id: z.string().describe('唯一标识')
})

export const deleteTechnologyResponseSchema = createResponseSchema(z.undefined())
