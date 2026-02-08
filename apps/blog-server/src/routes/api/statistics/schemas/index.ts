import { z } from "zod/v4";
import { createResponseSchema } from "../../../../schemas/response";

export const statisticsResponseSchema = createResponseSchema(z.object({
    articleCount: z.number().describe('文章数量'),
    friendCount: z.number().describe('朋友数量'),
    visitCount: z.number().describe('访客数量')
}))