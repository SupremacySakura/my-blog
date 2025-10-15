'use client'

import { ILabel } from '@/types/label'
import { IColor } from '@/types/color'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LabelTable() {
    const [labels, setLabels] = useState<ILabel[]>([])
    const [colors, setColors] = useState<IColor[]>([])
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [text, setText] = useState("")
    // 注意：这里我们仍然使用颜色的 **字符串值**（如 "#ff0000" 或 "red"）
    // 因为后端会用该值去匹配/创建 color 表并得到 id
    const [color, setColor] = useState("")
    const [backgroundColor, setBackgroundColor] = useState("")

    // -> 拉取标签（后端返回应包含 color, backgroundColor 字段）
    const fetchLabels = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/label`, { method: "GET" })
        const json = await res.json()
        setLabels(json.data || [])
    }

    // -> 拉取颜色表（只允许从这里选择）
    const fetchColors = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/color`, { method: "GET" })
        const json = await res.json()
        setColors(json.data || [])
    }

    useEffect(() => {
        fetchLabels()
        fetchColors()
    }, [])

    // 删除
    const handleDelete = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/label`, {
            method: "DELETE",
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (data.code === 200 || data.code === 200) {
            toast.success("删除成功")
            fetchLabels()
        } else {
            toast.error("删除失败")
        }
    }

    // 编辑：将 color/backgroundColor（字符串）预填
    const handleEdit = (item: ILabel) => {
        setIsEdit(true)
        setEditingId(item._id)
        setText(item.text)
        setColor(item.color || "")
        setBackgroundColor(item.backgroundColor || "")
        setOpen(true)
    }

    // 新增
    const handleAdd = () => {
        setIsEdit(false)
        setEditingId(null)
        setText("")
        setColor("")
        setBackgroundColor("")
        setOpen(true)
    }

    // 提交（POST/PUT）
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // 校验：必须从颜色表选择（确保 color/bg 有值且在 colors 列表中）
        if (!color || !colors.find(c => c.color === color)) {
            toast.error("请选择有效的文字颜色（从颜色表中选择）")
            return
        }
        if (!backgroundColor || !colors.find(c => c.color === backgroundColor)) {
            toast.error("请选择有效的背景颜色（从颜色表中选择）")
            return
        }

        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/my/label`
        const method = isEdit ? "PUT" : "POST"
        const body = isEdit
            ? JSON.stringify({ id: editingId, text, color, backgroundColor })
            : JSON.stringify({ text, color, backgroundColor })

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body,
        })
        const data = await res.json()

        if (data.code === 200) {
            toast.success(isEdit ? "修改成功" : "添加成功")
            setOpen(false)
            fetchLabels()
            setText("")
            setColor("")
            setBackgroundColor("")
        } else {
            toast.error(isEdit ? "修改失败" : "添加失败")
        }
    }

    return (
        <div className="w-full mt-5">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" onClick={handleAdd}>新增标签</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "编辑标签" : "新增标签"}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? "修改当前标签信息（颜色只能从颜色表选择）" : "添加新的标签（颜色只能从颜色表选择）"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="text">标签名称</Label>
                            <Input
                                id="text"
                                placeholder="请输入标签名称"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </div>

                        {/* 文字颜色：只能从颜色表选择（value 为颜色字符串） */}
                        <div className="space-y-2">
                            <Label>文字颜色</Label>
                            <Select value={color} onValueChange={setColor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="请选择文字颜色（从颜色表）" />
                                </SelectTrigger>
                                <SelectContent>
                                    {colors.map((c) => (
                                        <SelectItem key={c._id} value={c.color}>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-5 h-5 rounded border"
                                                    style={{ backgroundColor: c.color }}
                                                />
                                                <span>{c.color}{c.comment ? ` — ${c.comment}` : ''}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 背景颜色：只能从颜色表选择 */}
                        <div className="space-y-2">
                            <Label>背景颜色</Label>
                            <Select value={backgroundColor} onValueChange={setBackgroundColor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="请选择背景颜色（从颜色表）" />
                                </SelectTrigger>
                                <SelectContent>
                                    {colors.map((c) => (
                                        <SelectItem key={c._id} value={c.color}>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-5 h-5 rounded border"
                                                    style={{ backgroundColor: c.color }}
                                                />
                                                <span>{c.color}{c.comment ? ` — ${c.comment}` : ''}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="submit">{isEdit ? "保存修改" : "添加"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm mt-4">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">标签名</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">文字颜色</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">背景颜色</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">预览</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">操作</th>
                    </tr>
                </thead>

                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {labels.map((item) => (
                        <tr key={item._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-150">
                            <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">{item.text}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.color}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.backgroundColor}</td>
                            <td className="px-4 py-3">
                                <span
                                    className="px-3 py-1 rounded-full text-sm border"
                                    style={{
                                        color: item.color,
                                        backgroundColor: item.backgroundColor,
                                        borderColor: item.color,
                                    }}
                                >
                                    {item.text}
                                </span>
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                                <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>编辑</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>删除</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
