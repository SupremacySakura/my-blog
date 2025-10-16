'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import articleBackground from '../../../../public/article.png'
import { IArticleItem } from '@/types/article'
import ArticleCard from '@/components/business/ArticleCard'
import { getArticle } from '@/service'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import style from './index.module.css'

export default function Page() {
  const [article, setArticle] = useState<IArticleItem[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const visitMore = () => {
    setPage(page + 1)
  }
  useEffect(() => {
    setLoading(true);
    (async () => {
      const newArticle = await getArticle(page, 4)
      if (newArticle?.length === 0) {
        toast.error('没有更多文章了')
      }
      setArticle(prev => [...prev, ...(newArticle || [])])
      setLoading(false)
    })()
  }, [page])
  return (
    <div className="w-ful h-full">
      <Image
        src={articleBackground}
        alt="artcile"
        className="z-[-1] fixed w-full h-screen object-cover"
      />
      <section className='w-full flex flex-col gap-4 p-4 md:p-10 xl:p-22 items-center'>
        {article?.length > 0 && article?.map((item, index) => (<ArticleCard key={item._id + index} article={item}></ArticleCard>))}
        {loading && <div className={style.loader}></div>}
        {!loading && <Button onClick={visitMore} variant={'outline'} size={'sm'} className='w-30'>查看更多</Button>}
      </section>
    </div>
  )
}
