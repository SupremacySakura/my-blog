import { z } from 'zod/v4'
import { addressDataSchema } from '../schemas'

// 地址数据类型
export type Address = z.infer<typeof addressDataSchema>