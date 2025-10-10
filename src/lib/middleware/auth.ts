// lib/middleware/verifyToken.ts
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export function verifyToken(handler: Function) {
    return async (req: Request) => {
        const authHeader = req.headers.get('authorization')
        const token = authHeader?.split(' ')[1]

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET || 'my-blog')
            // 这里就能把 decoded 传给后续 handler
            return handler(req, decoded)
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
        }
    }
}
// 校验 Refresh Token
export function verifyRefreshToken(handler: Function) {
    return async (req: Request) => {
        const token = req.headers.get('refresh_token')

        if (!token) {
            return NextResponse.json({ error: 'Access denied. No token provided.', code: 401 }, { status: 401 })
        }

        try {
            const decoded = jwt.verify(token, process.env.REFRESH_SECRET || 'my-blog-refresh')
            return handler(req, decoded)
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token.', code: 403 }, { status: 403 })
        }
    }

}
// 校验 owner_token Token
export function verifyOwnerToken(handler: Function) {
    return async (req: Request) => {
        const token = req.headers.get('owner_token')

        if (!token) {
            return NextResponse.json({ error: 'Access denied. No token provided.', code: 401 }, { status: 401 })
        }

        try {
            const decoded = jwt.verify(token, process.env.OWNER_SECRET || 'my-blog-owner')
            return handler(req, decoded)
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token.', code: 403 }, { status: 403 })
        }
    }

}