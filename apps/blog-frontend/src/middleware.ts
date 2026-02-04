// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 每次请求都会走这里
export function middleware(request: NextRequest) {
    // 通过验证，继续请求
    return NextResponse.next()
}

// 配置需要拦截的路由
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
