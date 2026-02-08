import { ObjectId } from 'mongodb'
import { z } from 'zod/v4'
import { colorDataSchema, labelDataSchema, technologyDataSchema } from '../schemas'

// --- Color Types ---
export type Color = z.infer<typeof colorDataSchema>

// --- Label Types ---
export type Label = z.infer<typeof labelDataSchema>

export interface LabelDB {
    _id?: ObjectId
    text: string
    color_id: string
    bc_id: string
}

// --- Technology Types ---
export type Technology = z.infer<typeof technologyDataSchema>
