'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { use, useEffect, useRef, useState } from 'react'
interface IParams {
    id: string
}
export default function Page({ params }: { params: Promise<IParams> }) {
    // 获取文章ID
    const { id } = use(params)
    // 文章url
    const [article, setArticle] = useState<string>()
    // 是否首次加载
    const isMount = useRef(false)
    // 路由
    const router = useRouter()
    /**
     * 初始化文章
     */
    const initArticle = async () => {
        const res = await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/url?id=${id}`, { cache: "no-store" })).json()
        setArticle(res.data.article)
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/visit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: id })
        })
    }
    /**
     * 返回上一页
     */
    const handleBack = () => {
        router.back()
    }
    /**
     * 组件加载时初始化文章
     */
    useEffect(() => {
        if (!isMount.current) {
            isMount.current = true
            initArticle()
        }
    }, [])
    return (
        <div className='h-screen box-border p-10 dark:bg-gray-300/30 backdrop-blur-sm'>
            <Button onClick={() => handleBack()}>返回</Button>
            <iframe src={article} className='box-border mt-4 w-full h-full rounded-lg' />
        </div>
    )
}
