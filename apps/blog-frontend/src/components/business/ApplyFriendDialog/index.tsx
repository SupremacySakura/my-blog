"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { applyFriend } from "@/service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react" // 建议安装 lucide-react

export default function ApplyFriendDialog() {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ name: "", label: "", url: "" })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = await applyFriend(form)
            if (data.code === 200) {
                toast.success('申请成功，请耐心等待审核')
                setForm({ name: "", label: "", url: "" })
                setOpen(false)
            } else {
                toast.error(`申请失败: ${data.message}`)
            }
        } catch (err) {
            toast.error('请求出错，请稍后再试')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all">
                    立即申请互换
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-white/20 rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">申请友链</DialogTitle>
                    <DialogDescription>
                        填写您的站点信息，审核通过后将自动展示。
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="space-y-2">
                        <Label className="ml-1">站点名称</Label>
                        <Input
                            placeholder="你的博客名称"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="ml-1">站点简介</Label>
                        <Input
                            placeholder="一句话描述你的站点"
                            value={form.label}
                            onChange={(e) => setForm({ ...form, label: e.target.value })}
                            required
                            className="rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="ml-1">URL 地址</Label>
                        <Input
                            type="url"
                            placeholder="https://your-site.com"
                            value={form.url}
                            onChange={(e) => setForm({ ...form, url: e.target.value })}
                            required
                            className="rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loading ? '正在提交...' : '确认提交'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}