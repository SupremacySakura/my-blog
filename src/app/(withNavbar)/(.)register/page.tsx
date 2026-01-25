"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
export default function Page() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const handleSendVerificationCode = async () => {
        if (!email) {
            return toast.error("请输入邮箱")
        }
        try {
            await fetch("api/register/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            toast.success("发送成功")
        } catch (error) {
            console.error(error)
            toast.error("发送失败")
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const username = formData.get("username")
        const password = formData.get("password")
        const code = formData.get("code")
        const email = formData.get("email")
        try {
            const res = await fetch("api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, code, email }),
            })
            const data = await res.json()
            if (data.code === 200) {
                // alert("注册成功")
                toast.success("注册成功")
                router.push('/login')
            } else {
                // alert(data.message)
                toast.error('注册失败:', data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("注册失败")
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-2">
                        欢迎注册
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                        请输入您的账号
                    </p>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            用户名 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="请输入用户名"
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            密码 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="请输入密码"
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            邮箱 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="请输入邮箱"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            验证码 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="code"
                                placeholder="请输入验证码"
                                className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                            />
                            <button
                                type="button"
                                className="min-w-[120px] bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-300 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
                                onClick={() => { handleSendVerificationCode() }}
                            >
                                发送验证码
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-300 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
                        >
                            注册
                        </button>
                        <Link
                            href="/login"
                            className="flex-1 text-center bg-gray-100 text-gray-600 py-2 rounded-lg border hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            去登录
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
