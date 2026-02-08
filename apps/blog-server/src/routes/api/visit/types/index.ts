import { z } from 'zod/v4'
import { visitBodySchema } from '../schemas'

export type Visit = z.infer<typeof visitBodySchema>