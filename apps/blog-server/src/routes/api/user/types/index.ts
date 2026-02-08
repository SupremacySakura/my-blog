import { z } from 'zod/v4'
import { userDataSchema } from '../schemas'

export type User = z.infer<typeof userDataSchema>