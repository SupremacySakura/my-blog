import { ObjectId } from 'mongodb'
import { z } from 'zod/v4'
import { loginResponseDataSchema } from '../schemas'

export type User = z.infer<typeof loginResponseDataSchema>

export interface UserDB {
    _id: ObjectId
    username: string
    password?: string
    avatar?: string
    email?: string
    role?: string
}
