// lib/http.ts
import { useUserStore } from "@/store/user"
import { toast } from "sonner"
type RequestInterceptor = (
    input: RequestInfo | URL,
    init?: RequestInit
) => { input: RequestInfo | URL; init?: RequestInit }

type ResponseInterceptor = (response: Response) => Promise<Response>

class HttpFetch {
    private requestInterceptors: RequestInterceptor[] = []
    private responseInterceptors: ResponseInterceptor[] = []

    useRequest(interceptor: RequestInterceptor) {
        this.requestInterceptors.push(interceptor)
    }

    useResponse(interceptor: ResponseInterceptor) {
        this.responseInterceptors.push(interceptor)
    }

    async fetch(input: RequestInfo | URL, init?: RequestInit) {
        // 🔹 按顺序执行请求拦截器
        let request: { input: RequestInfo | URL; init?: RequestInit } = { input, init }
        for (const interceptor of this.requestInterceptors) {
            request = interceptor(request.input, request.init)
        }

        // 🔹 发出请求
        let response = await fetch(request.input, request.init)

        // 🔹 按顺序执行响应拦截器
        for (const interceptor of this.responseInterceptors) {
            response = await interceptor(response)
        }

        return response
    }
}

// 单例
const http = new HttpFetch()
http.useRequest((input, init = {}) => {
    const userStore = useUserStore.getState()

    // 确保 headers 是对象
    if (!init.headers) init.headers = {}

    // 如果 headers 是 Record<string, string>，才能这样设置
    if (init.headers instanceof Headers) {
        init.headers.set('Authorization', `Bearer ${userStore.token}`)
        init.headers.set('refreshToken', userStore.refreshToken)
        init.headers.set('ownerToken', userStore.ownerToken)
    } else {
        // 当 headers 是对象或数组时
        const headers = init.headers as Record<string, string>
        headers['Authorization'] = `Bearer ${userStore.token}`
        headers['refreshToken'] = userStore.refreshToken
        headers['ownerToken'] = userStore.ownerToken
        init.headers = headers
    }

    return { input, init }
})
http.useResponse(async (response) => {
    const authHeader = response.headers.get('authorization')
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        useUserStore.setState({ token })
    }
    const refreshToken = response.headers.get('refreshToken')
    if (refreshToken) {
        useUserStore.setState({ refreshToken })
    }
    const ownerToken = response.headers.get('ownerToken')
    if (ownerToken) {
        useUserStore.setState({ ownerToken })
    }
    // 🔹 401/403 自动刷新
    if (response.status === 401 || response.status === 403) {

        if (response.url.includes(`${process.env.NEXT_PUBLIC_SITE_URL}/api/login/refresh`)) {
            toast.error('登录已过期,请手动登录')
            return response // 避免死循环
        }
        toast.error('登录已过期，将尝试刷新')
        // 请求刷新接口（保存新 token 的工作交给拦截器上面那几行）
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/login/refresh`, { method: 'POST' })

        if (refreshRes.ok) {
            // 🔹 重试原请求（会自动带上最新 token）
            return fetch(response.url, response as any)
        } else {
            // 刷新失败，跳转登录
            window.location.href = `/login`
        }
    }
    return response
})
export default http