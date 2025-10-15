'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ITag } from '@/types/article'

export default function TagTable() {
    const [tags, setTags] = useState<ITag[]>([])
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [tagName, setTagName] = useState('')

    // 拉取标签
    const fetchTags = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/tag`)
        const json = await res.json()
        setTags(json.data || [])
    }

    useEffect(() => {
        fetchTags()
    }, [])

    // 删除
    const handleDelete = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/tag`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (data.code === 200 || data.code === 200) {
            toast.success('删除成功')
            fetchTags()
        } else {
            toast.error('删除失败')
        }
    }

    // 编辑
    const handleEdit = (item: ITag) => {
        setIsEdit(true)
        setEditingId(item._id)
        setTagName(item.tag)
        setOpen(true)
    }

    // 新增
    const handleAdd = () => {
        setIsEdit(false)
        setEditingId(null)
        setTagName('')
        setOpen(true)
    }

    // 提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/article/tag`
        const method = isEdit ? 'PUT' : 'POST'
        const body = JSON.stringify(isEdit ? { id: editingId, tag: tagName } : { tag: tagName })

        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body })
        const data = await res.json()
        if (data.code === 200) {
            toast.success(isEdit ? '修改成功' : '添加成功')
            setOpen(false)
            fetchTags()
            setTagName('')
        } else {
            toast.error(isEdit ? '修改失败' : '添加失败')
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
                        <DialogTitle>{isEdit ? '编辑标签' : '新增标签'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? '修改当前标签名称' : '添加新的标签'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="tag">标签名称</Label>
                            <Input
                                id="tag"
                                placeholder="请输入标签名称"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="submit">{isEdit ? '保存修改' : '添加'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm mt-4">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">标签名</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">操作</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {tags.map((item) => (
                        <tr key={item._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-150">
                            <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">{item.tag}</td>
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
