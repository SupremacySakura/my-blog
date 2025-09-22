"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <form className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-2">欢迎登录</h2>
          <p className="text-gray-500 text-center mb-6">请登录您的账号</p>

          <div>
            <label className="block mb-2 text-sm font-medium">
              用户名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="请输入用户名"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              密码 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="请输入密码"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* 登录类型选择 */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              登录类型 <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              登录
            </button>
            <Link
              href="/register"
              className="flex-1 text-center bg-gray-100 text-gray-600 py-2 rounded-lg border hover:bg-gray-200 transition"
            >
              去注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
