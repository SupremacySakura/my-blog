import { z } from 'zod/v4'
import { sayingDataSchema } from '../schemas'

export type Saying = z.infer<typeof sayingDataSchema>
