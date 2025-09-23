import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
// 秘钥与配置
export const accessSecret = process.env.ACCESS_SECRET || 'my-blog'
export const refreshSecret = process.env.REFRESH_SECRET || 'my-blog-refresh'
export const ownerSecret = process.env.OWNER_SECRET || 'my-blog-owner'
export const accessOptions = {
    expiresIn: 10 * 60
}
export const refreshOptions = {
    expiresIn: 7 * 24 * 60 * 60
}
export async function POST(request: Request) {
    try {
        // 解析请求体
        const body = await request.json()
        const { username, password, loginType } = body

        const client = await clientPromise
        const db = client.db('MyBlog')

        // 查找用户
        const result = await db.collection('user').findOne({ username })
        if (!result) {
            return NextResponse.json(
                { code: 400, message: '用户不存在' }
            )
        }

        // 验证密码
        if (result.password !== password) {
            return NextResponse.json(
                { code: 400, message: '密码错误' },
            )
        }
        // 生成 token
        const payload = {
            uid: result._id.toString(),
            username: result.username,
        }
        const accessToken = jwt.sign(payload, accessSecret, accessOptions)
        const refreshToken = jwt.sign(payload, refreshSecret, refreshOptions)

        // 返回数据 + 设置响应头
        const response = NextResponse.json({
            code: 200,
            message: '登录成功',
            data: {
                ...result,
                password: undefined, // 不返回密码
            },
        })

        response.headers.set('Authorization', `Bearer ${accessToken}`)
        response.headers.set('refresh_token', refreshToken)
        // 验证用户类型
        if (result.role === 'owner' && loginType === 'owner') {
            const ownerToken = jwt.sign(payload, ownerSecret, refreshOptions)
            response.headers.set('owner_token', ownerToken)
        }
        return response
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { code: 400, message: '服务器错误', error: String(err) },
        )
    }
}