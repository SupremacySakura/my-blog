'use client'
import React, { useEffect, useState } from 'react'
import { IColor } from '@/types/color'
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

export default function ColorTable() {
    const [colors, setColors] = useState<IColor[]>([])
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [color, setColor] = useState("")
    const [comment, setComment] = useState("")

    // ✅ 拉取颜色数据
    const fetchColors = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/color`, { method: "GET" })
        const json = await res.json()
        setColors(json.data)
    }

    useEffect(() => {
        fetchColors()
    }, [])

    // ✅ 删除颜色
    const handleDelete = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/color`, {
            method: "DELETE",
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (data.code === 0) {
            toast.success("删除成功")
            fetchColors()
        } else {
            toast.error("删除失败")
        }
    }

    // ✅ 打开编辑弹窗
    const handleEdit = (item: IColor) => {
        setIsEdit(true)
        setEditingId(item._id)
        setColor(item.color)
        setComment(item.comment)
        setOpen(true)
    }

    // ✅ 打开新增弹窗
    const handleAdd = () => {
        setIsEdit(false)
        setEditingId(null)
        setColor("")
        setComment("")
        setOpen(true)
    }

    // ✅ 提交（新增或编辑）
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/my/color`
        const method = isEdit ? "PUT" : "POST"
        const body = isEdit
            ? JSON.stringify({ id: editingId, color, comment })
            : JSON.stringify({ color, comment })

        const res = await fetch(url, { method, body })
        const data = await res.json()

        if (data.code === 0) {
            toast.success(isEdit ? "修改成功" : "添加成功")
            setOpen(false)
            fetchColors()
            setColor("")
            setComment("")
        } else {
            toast.error(isEdit ? "修改失败" : "添加失败")
        }
    }

    return (
        <div className="w-full mt-5">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" onClick={handleAdd}>新增颜色</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "编辑颜色" : "新增颜色"}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? "修改当前颜色信息" : "添加新的颜色"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="color">颜色值</Label>
                            <Input
                                id="color"
                                placeholder="#FFFFFF 或 rgb(255,255,255)"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="comment">备注</Label>
                            <Input
                                id="comment"
                                placeholder="颜色用途或说明"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
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
                        <th className="px-4 py-3 text-left text-sm font-semibold">颜色</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">备注</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">操作</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {colors.map((item) => (
                        <tr key={item._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-150">
                            <td className="px-4 py-3 flex items-center gap-2">
                                <div
                                    className="w-5 h-5 rounded-full border"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-gray-800 dark:text-gray-100">{item.color}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.comment}</td>
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
