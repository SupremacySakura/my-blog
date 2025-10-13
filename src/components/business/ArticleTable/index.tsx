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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IArticleItem, ITag } from '@/types/article'
import { IUser } from '@/types/user'

export default function ArticleTable() {
    const [articles, setArticles] = useState<IArticleItem[]>([])
    const [tagsList, setTagsList] = useState<ITag[]>([]) // 所有标签
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    const [head, setHead] = useState('')
    const [digest, setDigest] = useState('')
    const [article, setArticle] = useState('')
    const [cover, setCover] = useState('')
    const [selectedTags, setSelectedTags] = useState<ITag[]>([])
    const [userId, setUserId] = useState<string>('')

    // 分页
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    const fetchArticleCount = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/article/count`
        )
        const data = await res.json()
        if (data.code === 0) {
            setTotal(data.data || 0)
        }
    }
    const fetchArticles = async () => {
        fetchArticleCount()
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article?page=${page}&pageSize=${pageSize}`)
        const json = await res.json()
        setArticles(json.data || [])
    }

    const fetchTags = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/tag`)
        const json = await res.json()
        setTagsList(json.data || [])
    }

    useEffect(() => {
        fetchArticles()
        fetchTags()
    }, [page])

    const handleToggle = (item: ITag) => {
        const exists = selectedTags.some(t => t._id === item._id)
        if (exists) {
            setSelectedTags(selectedTags.filter((t) => t._id !== item._id))
        } else {
            setSelectedTags([...selectedTags || [], item])
        }
    }
    const handleDelete = async (id: number) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (data.code === 0 || data.code === 200) {
            toast.success('删除成功')
            fetchArticles()
        } else {
            toast.error('删除失败')
        }
    }

    const handleEdit = (item: IArticleItem) => {
        setIsEdit(true)
        setEditingId(item._id)
        setHead(item.head)
        setDigest(item.digest)
        setArticle(item.article)
        setCover(item.cover)
        setSelectedTags(item.tags)
        setUserId(item?.user?._id)
        setOpen(true)
    }

    const handleAdd = () => {
        setIsEdit(false)
        setEditingId(null)
        setHead('')
        setDigest('')
        setArticle('')
        setCover('')
        setSelectedTags([])
        setUserId('')
        setOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/article`
        const method = isEdit ? 'PUT' : 'POST'
        const body = JSON.stringify({
            id: editingId,
            head,
            digest,
            article,
            cover,
            tags: selectedTags.map((item) => item._id),
            user_id: userId,
        })
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body })
        const data = await res.json()
        console.log(data)
        if (data.code === 0) {
            toast.success(isEdit ? '修改成功' : '添加成功')
            setOpen(false)
            fetchArticles()
        } else {
            toast.error(isEdit ? '修改失败' : '添加失败')
        }
    }

    const totalPages = Math.ceil(total / pageSize)
    return (
        <div className="w-full mt-5">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" onClick={handleAdd}>新增文章</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? '编辑文章' : '新增文章'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? '修改当前文章信息' : '添加新的文章'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="head">标题</Label>
                            <Input id="head" value={head} onChange={(e) => setHead(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="digest">摘要</Label>
                            <Input id="digest" value={digest} onChange={(e) => setDigest(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="article">正文</Label>
                            <Input id="article" value={article} onChange={(e) => setArticle(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cover">封面图片</Label>
                            <Input id="cover" value={cover} onChange={(e) => setCover(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label>标签</Label>
                            <div>
                                {tagsList.map(item => {
                                    const isSelected = selectedTags.some(t => t._id === item._id)
                                    return (
                                        <span
                                            key={item._id}
                                            onClick={() => handleToggle(item)}
                                            className={`px-3 py-1 rounded-full text-sm cursor-pointer border transition
                ${isSelected
                                                    ? "bg-blue-500 text-white border-blue-500"
                                                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                                }`}
                                        >
                                            {item.tag}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user">用户ID</Label>
                            <Input id="user" value={userId} onChange={(e) => setUserId(e.target.value)} required />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="submit">{isEdit ? '保存修改' : '添加'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 表格 */}
            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm mt-4">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">标题</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">摘要</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">封面</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">标签</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">用户</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">操作</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {articles.map((item) => (
                        <tr key={item?._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-150">
                            <td className="px-4 py-3 font-medium">{item?.head}</td>
                            <td className="px-4 py-3">{item?.digest}</td>
                            <td className="px-4 py-3"><img src={item?.cover} alt={item?.head} className="w-12 h-12 object-cover" /></td>
                            <td className="px-4 py-3">{item?.tags.map(t => t.tag).join(', ')}</td>
                            <td className="px-4 py-3">{item?.user?.username}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>编辑</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(item?._id)}>删除</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 分页 */}
            <div className="flex justify-end gap-2 mt-4">
                <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(p - 1, 1))}>上一页</Button>
                <span className="px-2 py-1">第 {page} / {totalPages} 页</span>
                <Button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(p + 1, totalPages))}>下一页</Button>
            </div>
        </div>
    )
}
