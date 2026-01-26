'use client'
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { IMessageItem } from "@/types/message"
import { countMessages, getMessages, deleteMessage } from "@/service"

export default function MessageTable() {
    const [messages, setMessages] = useState<IMessageItem[]>([])
    const [page, setPage] = useState(1)
    const [pageSize] = useState(10)
    const [total, setTotal] = useState(0)

    // 获取留言总数
    const fetchMessageCount = async () => {
        const totalCount = await countMessages()
        setTotal(totalCount || 0)
    }
    // ✅ 拉取留言数据（分页）
    const fetchMessages = async (currentPage = 1) => {
        fetchMessageCount()
        const list = await getMessages(currentPage, pageSize)
        setMessages(list)
    }

    useEffect(() => {
        fetchMessages(page)
    }, [page])

    // ✅ 删除留言
    const handleDelete = async (id: string) => {
        const data = await deleteMessage(id)
        if (data.code === 200) {
            toast.success("删除成功")
            // 如果删除后当前页没数据了，自动跳到上一页
            const newTotal = total - 1
            const newPage = Math.min(page, Math.ceil(newTotal / pageSize)) || 1
            setPage(newPage)
            fetchMessages(newPage)
        } else {
            toast.error("删除失败")
        }
    }

    const totalPages = Math.ceil(total / pageSize)

    return (
        <div className="w-full mt-5">
            <h2 className="text-xl font-semibold mb-4">留言管理</h2>

            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">用户</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">内容</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">时间</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">操作</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {messages.map((msg) => (
                        <tr key={msg._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                            <td className="px-4 py-3 flex items-center space-x-2">
                                <img
                                    src={msg.user?.avatar || "/default-avatar.png"}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="text-gray-800 dark:text-gray-100">
                                    {msg.user?.username || "匿名"}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                {msg.content}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-sm">
                                {msg.time
                                    ? new Date(msg.time).toLocaleString()
                                    : "-"}
                            </td>
                            <td className="px-4 py-3">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(msg._id)}
                                >
                                    删除
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-4">暂无留言</div>
            )}

            {/* ✅ 分页控制 */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >
                        上一页
                    </Button>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                        第 {page} / {totalPages} 页
                    </span>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    >
                        下一页
                    </Button>
                </div>
            )}
        </div>
    )
}
