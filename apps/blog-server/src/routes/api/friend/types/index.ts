import { z } from 'zod/v4'
import { friendDataSchema, noticeDataSchema } from '../schemas/index.'

export type Notice = z.infer<typeof noticeDataSchema>

export type Friend = z.infer<typeof friendDataSchema>