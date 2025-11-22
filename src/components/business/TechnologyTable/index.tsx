'use client'
import { ITechnology } from '@/types/technology'
import React, { useEffect, useState } from 'react'
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

export default function TechnologyTable() {
    const [techStacks, setTechStacks] = useState<ITechnology[]>([])
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [name, setName] = useState("")
    const [src, setSrc] = useState("")
    const [icon, setIcon] = useState("")
    const [note, setNote] = useState("")

    // ✅ 拉取数据
    const fetchTechStacks = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/technology`, { method: "GET" })
        const json = await res.json()
        setTechStacks(json.data)
    }

    useEffect(() => {
        fetchTechStacks()
    }, [])

    // ✅ 删除技术栈
    const handleDelete = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/technology`, {
            method: "DELETE",
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (data.code === 200) {
            toast.success("删除成功")
            fetchTechStacks()
        } else {
            toast.error("删除失败")
        }
    }

    // ✅ 打开编辑弹窗
    const handleEdit = (item: ITechnology) => {
        setIsEdit(true)
        setEditingId(item._id)
        setName(item.text)
        setSrc(item.src)
        setIcon(item.icon)
        setNote(item.note)
        setOpen(true)
    }

    // ✅ 打开新增弹窗
    const handleAdd = () => {
        setIsEdit(false)
        setEditingId(null)
        setName("")
        setSrc("")
        setIcon("")
        setNote("")
        setOpen(true)
    }

    // ✅ 提交（新增或编辑）
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/my/technology`
        const method = isEdit ? "PUT" : "POST"
        const body = isEdit
            ? JSON.stringify({ id: editingId, text: name, src, icon, note })
            : JSON.stringify({ text: name, src, icon, note })

        const res = await fetch(url, { method, body })
        const data = await res.json()
        console.log(data)
        if (data.code === 200) {
            toast.success(isEdit ? "修改成功" : "添加成功")
            setOpen(false)
            fetchTechStacks()
            setName("")
            setSrc("")
            setIcon("")
            setNote("")
        } else {
            toast.error(isEdit ? "修改失败" : "添加失败")
        }
    }

    return (
        <div className="w-full mt-5">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" onClick={handleAdd} className="w-full sm:w-auto">新增技术栈</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-w-[95vw] mx-4 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "编辑技术栈" : "新增技术栈"}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? "修改当前技术栈信息" : "添加新的技术栈"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">技术栈名称</Label>
                            <Input
                                id="name"
                                placeholder="请输入技术栈名称"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="src">官网地址</Label>
                            <Input
                                id="src"
                                placeholder="请输入官网地址"
                                value={src}
                                onChange={(e) => setSrc(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon">图标链接</Label>
                            <Input
                                id="icon"
                                placeholder="请输入图标 URL"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="note">备注</Label>
                            <Input
                                id="note"
                                placeholder="请输入备注"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
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
                {techStacks.map((item) => (
                    <div key={item._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={item.icon} alt={item.text} className="w-8 h-8 flex-shrink-0" />
                            <p className="text-gray-800 dark:text-gray-100 font-medium">{item.text}</p>
                        </div>
                        <div className="mb-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">官网</p>
                            <a href={item.src} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all">
                                {item.src}
                            </a>
                        </div>
                        {item.note && (
                            <div className="mb-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">备注</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.note}</p>
                            </div>
                        )}
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
                            <th className="px-4 py-3 text-left text-sm font-semibold">名称</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">官网</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">图标</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">备注</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {techStacks.map((item) => (
                            <tr key={item._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-150">
                                <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">{item.text}</td>
                                <td className="px-4 py-3">
                                    <a href={item.src} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                                        {item.src}
                                    </a>
                                </td>
                                <td className="px-4 py-3">
                                    <img src={item.icon} alt={item.text} className="w-6 h-6" />
                                </td>
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 break-words">{item.note}</td>
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
