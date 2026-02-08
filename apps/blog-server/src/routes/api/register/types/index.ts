import { z } from 'zod/v4'
import { registerBodySchema, verifyBodySchema } from '../schemas'

export type RegisterBody = z.infer<typeof registerBodySchema>
export type VerifyBody = z.infer<typeof verifyBodySchema>

export interface VerificationCode {
    code: string;
    expires: number;
}
