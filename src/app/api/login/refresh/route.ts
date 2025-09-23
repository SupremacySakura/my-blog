import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import { accessOptions, accessSecret } from "../route"
import { verifyRefreshToken } from "@/lib/middleware/auth"
// 验证码缓存
export const verificationCodes = new Map()
const refrshToken = async (request: Request, payload: { uid: string, username: string }) => {
    const client = await clientPromise
    const db = client.db('MyBlog')
    try {
        // 如果前面校验通过，再查询数据库
        const result = await db.collection('user').findOne({ _id: new ObjectId(payload?.uid as string) })
        const newPayload = {
            uid: payload.uid,
            username: payload.username,
        }

        const accessToken = jwt.sign(newPayload, accessSecret, accessOptions)

        const responseData = {
            code: 200,
            message: '刷新成功',
            data: {
                ...result,
                password: '', // 清空密码
            },
        }
        const response = NextResponse.json(responseData)
        response.headers.set('Authorization', `Bearer ${accessToken}`)
        return response
    } catch (err) {
        return NextResponse.json({
            code: 500,
            message: '服务器错误',
            error: err
        })
    }

}
export const POST = verifyRefreshToken(refrshToken)