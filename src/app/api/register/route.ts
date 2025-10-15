import { NextResponse } from 'next/server'
import { verificationCodes } from './verify/route'
import clientPromise from '@/lib/mongodb'
/**
 * 注册用户
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    const body = await request.json()
    const { username, password, email, code } = body
    const client = await clientPromise
    const db = client.db('MyBlog')
    if (!verificationCodes.has(email)) {
        return NextResponse.json({
            code: 400,
            message: '验证码已过期',
        })
    }
    const verificationCode = verificationCodes.get(email)
    if (Date.now() - verificationCode.expires > 10 * 60 * 1000) {
        verificationCodes.delete(email)
        return NextResponse.json({
            code: 400,
            message: '验证码已过期',
        })
    }
    if (verificationCode.code !== code) {
        return NextResponse.json({
            code: 400,
            message: '验证码错误',
        })
    }
    try {
        const result = await db.collection('user').findOne({ username })
        if (result) {
            return NextResponse.json({
                code: 400,
                message: '用户已存在',
            })
        }
        const data = await db.collection('user').insertOne({ username, password, email })
        return NextResponse.json({
            code: 200,
            message: '注册成功',
            data,
        })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: '服务器错误',
            error
        })
    }
}