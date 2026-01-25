'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import http from "@/lib/http"
import { useUserStore } from "@/store/user"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [loginType, setLoginType] = useState<string>("") // 保存选中值
  const router = useRouter()
  const userStore = useUserStore()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username")
    const password = formData.get("password")

    try {
      const res = await http.fetch("api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, loginType }),
      })

      const data = await res.json()

      if (data.code === 200) {
        userStore.setUser(data.data)
        // alert("登录成功")
        toast.success("登录成功")
        const owner_token = res.headers.get("owner_token")
        if (owner_token) {
          // 跳转到后台页面
          return router.push('/backstage')
        }
        // 跳转到主页
        router.push("/")
      } else {
        // alert(data.message || "登录失败")
        toast.error("登录失败:", data.message)
      }
    } catch (err) {
      console.error("请求失败:", err)
      // alert("服务器错误")
      toast.error("服务器错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-2">欢迎登录</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">请登录您的账号</p>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              用户名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="请输入用户名"
              required
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
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              登录类型 <span className="text-red-500">*</span>
            </label>
            <Select value={loginType} onValueChange={setLoginType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="用户类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">普通用户</SelectItem>
                <SelectItem value="owner">管理员</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-300 disabled:opacity-50 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
            >
              {loading ? "登录中..." : "登录"}
            </button>
            <Link
              href="/register"
              className="flex-1 text-center bg-gray-100 text-gray-600 py-2 rounded-lg border hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              去注册
            </Link>
          </div>
        </form>
      </div>
    </div>

  )
}
