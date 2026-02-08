import { ObjectId } from 'mongodb'
import { z } from 'zod/v4'
import { messageDataSchema } from '../schemas'

export type Message = z.infer<typeof messageDataSchema>

export interface MessageDB {
    _id?: ObjectId
    content: string
    time: string
    user_id: ObjectId
}
