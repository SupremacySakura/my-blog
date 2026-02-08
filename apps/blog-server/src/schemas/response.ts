import { z } from 'zod/v4'

export const createResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    code: z.number().describe('响应码'),
    data: dataSchema.describe('响应数据'),
    message: z.string().describe('响应信息'),
    error: z.any().optional().describe('错误信息'),
  })
}
