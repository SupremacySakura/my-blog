"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { applyFriend } from "@/service"
import { toast } from "sonner"

export default function ApplyFriendDialog() {
    const [name, setName] = useState("")
    const [label, setLabel] = useState("")
    const [url, setUrl] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = await applyFriend({ name, label, url })
        if (data.code === 200) {
            toast.success('申请成功')
        } else {
            toast.error(`申请失败${data.message}`)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">申请友链</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>申请友链</DialogTitle>
                    <DialogDescription>
                        请填写以下信息，我们会尽快审核~
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="siteName">站点名称</Label>
                        <Input
                            id="siteName"
                            name="siteName"
                            placeholder="请输入站点名称"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="siteDesc">站点简介</Label>
                        <Input
                            id="siteDesc"
                            name="siteDesc"
                            placeholder="一句话介绍你的站点"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="siteUrl">站点地址</Label>
                        <Input
                            id="siteUrl"
                            name="siteUrl"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="submit">提交申请</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
