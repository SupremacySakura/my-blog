import { ObjectId } from 'mongodb'
import { z } from 'zod/v4'
import { messageDataSchema, messageWithUserSchema } from '../schemas'

export type Message = z.infer<typeof messageDataSchema>

export type MessageWithUser = z.infer<typeof messageWithUserSchema>
export interface MessageDB {
    _id?: ObjectId
    content: string
    time: string
    user_id: ObjectId
}
