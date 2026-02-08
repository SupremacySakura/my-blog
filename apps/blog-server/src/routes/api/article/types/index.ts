import { z } from 'zod/v4'
import { articleDataSchema, fullArticleDataSchema, tagDataSchema } from '../schemas'

export type Tag = z.infer<typeof tagDataSchema>

export type Article = z.infer<typeof articleDataSchema>

export type fullArticle = z.infer<typeof fullArticleDataSchema>