'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import articleBackground from '../../../../public/article.png'
import { IArticleItem } from '@/types/article'
import ArticleCard from '@/components/business/ArticleCard'
import { getArticles } from '@/service'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Flame, Search as SearchIcon } from "lucide-react"
import { toast } from "sonner"
import style from './index.module.css'

export default function Page() {
  const [article, setArticle] = useState<IArticleItem[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>("")
  const [isMoreShow, setIsMoreShow] = useState<boolean>(true)
  const visitMore = () => {
    setPage(page + 1)
  }
  useEffect(() => {
    setLoading(true);
    (async () => {
      const newArticle = await getArticles(page, 4)
      if (newArticle?.length === 0) {
        toast.error('没有更多文章了')
      }
      setArticle(prev => [...prev, ...(newArticle || [])])
      setLoading(false)
    })()
  }, [page])
  const normalize = (str: string = "") => {
    return str.replace(/\s+/g, "").toLowerCase()
  }

  const onSearch = () => {
    const key = normalize(keyword)

    // 关键词为空
    if (!key) {
      setArticle([])
      setPage(page !== 1 ? 1 : 2)
      setIsMoreShow(true)
      return
    }

    setIsMoreShow(false)

    const searchResult = article.filter(item => {
      return [
        item.head,
        item.digest,
        item.time,
        item.user?.username,
        ...(item.tags?.map(tag => tag.tag) ?? [])
      ]
        .map(normalize)
        .some(text => text.includes(key))
    })

    setArticle(searchResult)
  }

  return (
    <div className="w-full h-full">
      <section className='w-full max-w-4xl mx-auto flex flex-col gap-4 p-4 md:p-8 xl:p-12 items-stretch'>
        <div className="w-full flex items-center gap-3">
          <div className="relative flex-1">
            <Flame className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500 dark:text-orange-400" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜文章"
              className="h-11 pl-10 rounded-full bg-white text-gray-900 dark:bg-white/5 dark:text-white border-gray-200 dark:border-white/10 dark:placeholder:text-gray-400"
            />
          </div>
          <Button
            onClick={onSearch}
            className="h-11 rounded-full px-6 bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            <SearchIcon className="w-4 h-4" />
            搜索
          </Button>
        </div>
        {article?.length > 0 && article?.map((item, index) => (<ArticleCard key={item._id + index} article={item}></ArticleCard>))}
        {loading && <div className={style.loader}></div>}
        {!loading && isMoreShow && <Button onClick={visitMore} variant={'outline'} size={'sm'} className='self-center px-6'>查看更多</Button>}
      </section>
    </div>
  )
}
