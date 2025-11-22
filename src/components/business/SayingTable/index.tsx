'use client'
import React, { useEffect, useState } from 'react'
import { ISaying } from '@/types/saying'
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SayingTable() {
    const [sayings, setSayings] = useState<ISaying[]>([])
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [text, setText] = useState("")

    // ✅ 拉取名言数据
    const fetchSayings = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`, { method: "GET" })
        const json = await res.json()
        setSayings(json.data)
    }

    useEffect(() => {
        fetchSayings()
    }, [])

    // ✅ 删除名言
    const handleDelete = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`, {
            method: "DELETE",
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (data.code === 200) {
            toast.success("删除成功")
            fetchSayings()
        } else {
            toast.error("删除失败")
        }
    }

    // ✅ 打开编辑弹窗
    const handleEdit = (item: ISaying) => {
        setIsEdit(true)
        setEditingId(item._id)
        setText(item.text)
        setOpen(true)
    }

    // ✅ 打开新增弹窗
    const handleAdd = () => {
        setIsEdit(false)
        setEditingId(null)
        setText("")
        setOpen(true)
    }

    // ✅ 提交（新增或编辑）
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`
        const method = isEdit ? "PUT" : "POST"
        const body = isEdit
            ? JSON.stringify({ id: editingId, text })
            : JSON.stringify({ text })

        const res = await fetch(url, { method, body })
        const data = await res.json()

        if (data.code === 200) {
            toast.success(isEdit ? "修改成功" : "添加成功")
            setOpen(false)
            fetchSayings()
            setText("")
        } else {
            toast.error(isEdit ? "修改失败" : "添加失败")
        }
    }

    return (
        <div className="w-full mt-5">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" onClick={handleAdd} className="w-full sm:w-auto">新增名言</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-w-[95vw] mx-4">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "编辑名言" : "新增名言"}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? "修改当前名言内容" : "添加新的名言"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="text">名言内容</Label>
                            <Input
                                id="text"
                                placeholder="请输入名言或短句"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="submit">{isEdit ? "保存修改" : "添加"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 移动端卡片布局 */}
            <div className="block md:hidden mt-4 space-y-3">
                {sayings.map((item) => (
                    <div key={item._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm">
                        <p className="text-gray-800 dark:text-gray-100 mb-3 break-words">{item.text}</p>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => handleEdit(item)} className="flex-1">编辑</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)} className="flex-1">删除</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 桌面端表格布局 */}
            <div className="hidden md:block overflow-x-auto mt-4">
                <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">名言内容</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {sayings.map((item) => (
                            <tr key={item._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-150">
                                <td className="px-4 py-3 text-gray-800 dark:text-gray-100 break-words">{item.text}</td>
                                <td className="px-4 py-3 flex gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>编辑</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>删除</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
