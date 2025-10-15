'use client'
import { IFriend } from '@/types/friend'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function FriendTable() {
    const [friends, setFriends] = useState<IFriend[]>([])

    // ✅ 拉取好友数据
    const fetchFriends = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend?needAll=${true}`, { method: "GET" })
        const data = await res.json()
        if (data.code === 200) setFriends(data.data)
    }

    useEffect(() => {
        fetchFriends()
    }, [])

    // ✅ 删除好友
    const handleDelete = async (id: number) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend`, {
            method: "DELETE",
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (data.code === 200) {
            toast.success("删除成功")
            fetchFriends()
        } else {
            toast.error("删除失败")
        }
    }

    // ✅ 冻结/解冻好友
    const toggleStatus = async (friend: IFriend) => {
        const newStatus = friend.status === 1 ? 0 : 1
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend`, {
            method: "PUT",
            body: JSON.stringify({ id: friend._id, status: newStatus })
        })
        const data = await res.json()
        if (data.code === 200) {
            toast.success(newStatus === 1 ? "已解冻" : "已冻结")
            fetchFriends()
        } else {
            toast.error("操作失败")
        }
    }

    return (
        <div className="w-full mt-5">
            <h2 className="text-xl font-semibold mb-4">友情链接管理</h2>

            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">名称</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">标签</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">URL</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">用户</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">状态</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">操作</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {friends.map(friend => (
                        <tr key={friend._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-150">
                            <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">{friend.name}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{friend.label}</td>
                            <td className="px-4 py-3 text-blue-600 dark:text-blue-400 hover:underline">
                                <a href={friend?.url} target="_blank" rel="noopener noreferrer">{friend.url}</a>
                            </td>
                            <td className="px-4 py-3 flex items-center space-x-2">
                                <img
                                    src={friend?.user?.avatar}
                                    alt={friend?.user?.username}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span>{friend?.user?.username}</span>
                            </td>
                            <td className="px-4 py-3">
                                {friend.status === 1 ? (
                                    <Label className="bg-green-100 text-green-800">正常</Label>
                                ) : (
                                    <Label className="bg-red-100 text-red-800">冻结</Label>
                                )}
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                                <Button
                                    variant={friend.status === 1 ? "destructive" : "secondary"}
                                    size="sm"
                                    onClick={() => toggleStatus(friend)}
                                >
                                    {friend.status === 1 ? "冻结" : "解冻"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(friend._id)}
                                >
                                    删除
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {friends.length === 0 && (
                <div className="text-center text-gray-500 mt-4">暂无友情链接</div>
            )}
        </div>
    )
}
