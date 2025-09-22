"use client";

import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
                <form className="space-y-4">
                    <h2 className="text-2xl font-bold text-center mb-2">欢迎注册</h2>
                    <p className="text-gray-500 text-center mb-6">请输入您的账号</p>

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

                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            邮箱 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="请输入邮箱"
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            验证码 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="请输入验证码"
                                className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                className="min-w-[120px] bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                            >
                                发送验证码
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            注册
                        </button>
                        <Link
                            href="/login"
                            className="flex-1 text-center bg-gray-100 text-gray-600 py-2 rounded-lg border hover:bg-gray-200 transition"
                        >
                            去登录
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
