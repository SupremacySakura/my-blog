import sendVerificationEmail from "@/lib/mail"
import { NextResponse } from "next/server"
// 验证码缓存
export const verificationCodes = new Map()
/**
 * 发送验证码
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    const body = await request.json()
    const { email } = body
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    try {
        await sendVerificationEmail(email, code)
        verificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 })
        return NextResponse.json({ message: '验证码已发送', code: 200 })
    } catch (error) {
        return NextResponse.json({ message: '发送失败', error, code: 500 })
    }
}