'use client'
import { IFriend } from '@/types/friend'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { getAllFriends, deleteFriend, updateFriendStatus } from "@/service"

export default function FriendTable() {
    const [friends, setFriends] = useState<IFriend[]>([])

    // ✅ 拉取好友数据
    const fetchFriends = async () => {
        const data = await getAllFriends()
        setFriends(data)
    }

    useEffect(() => {
        fetchFriends()
    }, [])

    // ✅ 删除好友
    const handleDelete = async (id: number) => {
        const data = await deleteFriend(String(id))
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
        const data = await updateFriendStatus(String(friend._id), newStatus)
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

            {/* 移动端卡片布局 */}
            <div className="block md:hidden space-y-3">
                {friends.map(friend => (
                    <div key={friend._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            {friend?.user?.avatar && (
                                <img
                                    src={friend.user.avatar}
                                    alt={friend?.user?.username}
                                    className="w-10 h-10 rounded-full flex-shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-gray-800 dark:text-gray-100 font-medium break-words">{friend.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{friend?.user?.username}</p>
                            </div>
                            <div>
                                {friend.status === 1 ? (
                                    <Label className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs">正常</Label>
                                ) : (
                                    <Label className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-xs">冻结</Label>
                                )}
                            </div>
                        </div>
                        {friend.label && (
                            <div className="mb-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">标签</p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{friend.label}</p>
                            </div>
                        )}
                        <div className="mb-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">URL</p>
                            <a 
                                href={friend?.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                            >
                                {friend.url}
                            </a>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={friend.status === 1 ? "destructive" : "secondary"}
                                size="sm"
                                onClick={() => toggleStatus(friend)}
                                className="flex-1"
                            >
                                {friend.status === 1 ? "冻结" : "解冻"}
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(friend._id)}
                                className="flex-1"
                            >
                                删除
                            </Button>
                        </div>
                    </div>
                ))}
                {friends.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-4">暂无友情链接</div>
                )}
            </div>

            {/* 桌面端表格布局 */}
            <div className="hidden md:block overflow-x-auto">
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
                                <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium break-words">{friend.name}</td>
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 break-words">{friend.label}</td>
                                <td className="px-4 py-3">
                                    <a 
                                        href={friend?.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                    >
                                        {friend.url}
                                    </a>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        {friend?.user?.avatar && (
                                            <img
                                                src={friend.user.avatar}
                                                alt={friend?.user?.username}
                                                className="w-6 h-6 rounded-full flex-shrink-0"
                                            />
                                        )}
                                        <span className="text-gray-600 dark:text-gray-300">{friend?.user?.username}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {friend.status === 1 ? (
                                        <Label className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs">正常</Label>
                                    ) : (
                                        <Label className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-xs">冻结</Label>
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
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-4">暂无友情链接</div>
                )}
            </div>
        </div>
    )
}
