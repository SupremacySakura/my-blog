'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { IArticleItem } from '@/types/article'
import ArticleCard from '@/components/business/ArticleCard'
import { getArticles, countArticles } from '@/service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Flame, Search as SearchIcon, Inbox, RotateCcw, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function Page() {
  const [articles, setArticles] = useState<IArticleItem[]>([])
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [keyword, setKeyword] = useState<string>('')
  const [isSearching, setIsSearching] = useState(false)

  const pageSize = 5
  const totalPage = Math.ceil(total / pageSize)

  const fetchArticles = useCallback(async (pageNo: number) => {
    setLoading(true)
    try {
      const [list, count] = await Promise.all([
        getArticles(pageNo, pageSize),
        countArticles(),
      ])
      setArticles(list || [])
      setTotal(count)
    } catch (error) {
      toast.error('获取文章失败')
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  useEffect(() => {
    if (!isSearching) {
      fetchArticles(page)
    }
  }, [page, fetchArticles, isSearching])

  const onSearch = () => {
    const key = keyword.trim().toLowerCase()
    if (!key) {
      setIsSearching(false); fetchArticles(page); return
    }
    setIsSearching(true)
    const filtered = articles.filter(item => 
      item.head.toLowerCase().includes(key) || 
      item.digest.toLowerCase().includes(key) ||
      item.tags?.some(t => t.tag.toLowerCase().includes(key))
    )
    if (filtered.length === 0) toast.info('当前页面未找到相关内容')
    setArticles(filtered)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] selection:bg-orange-500/30">
      {/* 顶部：浮动玻璃搜索胶囊 */}
      <div className="sticky top-0 z-50 w-full pt-4 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <div className="relative group bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] p-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-orange-500/10 hover:border-orange-500/20">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <Input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && onSearch()}
                  placeholder="探索感兴趣的灵感..."
                  className="h-12 pl-12 pr-4 rounded-[1.5rem] bg-transparent border-none focus-visible:ring-0 text-sm font-medium placeholder:text-gray-400 dark:text-white"
                />
              </div>
              <Button
                onClick={onSearch}
                className="h-12 px-8 rounded-[1.5rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* 标题装饰区 */}
        <div className="flex items-end justify-between mb-12 px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" />
              <span>Perspective</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {isSearching ? 'Search Results' : 'Latest Stories'}
            </h2>
          </div>
          
          {isSearching && (
            <Button 
              variant="ghost" 
              className="rounded-full text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors gap-2"
              onClick={() => { setKeyword(''); setIsSearching(false); }}
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </Button>
          )}
        </div>

        {/* 文章列表 */}
        <div className="space-y-8">
          {loading ? (
            // 骨架屏：同步内嵌圆角风格
            [1, 2, 3].map(i => (
              <div key={i} className="w-full h-64 rounded-[2.5rem] bg-white/40 dark:bg-zinc-900/40 border border-white/40 dark:border-white/10 animate-pulse flex p-4 gap-6">
                 <div className="w-64 h-full bg-gray-200 dark:bg-zinc-800 rounded-[2rem]" />
                 <div className="flex-1 py-4 space-y-4">
                    <div className="w-1/3 h-4 bg-gray-200 dark:bg-zinc-800 rounded-full" />
                    <div className="w-full h-8 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
                    <div className="w-full h-20 bg-gray-200 dark:bg-zinc-800 rounded-2xl" />
                 </div>
              </div>
            ))
          ) : articles.length > 0 ? (
            articles.map(item => <ArticleCard key={item._id} article={item} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white/20 dark:bg-zinc-900/20 rounded-[3rem] border border-dashed border-gray-200 dark:border-zinc-800">
              <Inbox className="w-12 h-12 mb-4 text-gray-300 dark:text-zinc-700" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nothing Found</p>
            </div>
          )}
        </div>

        {/* 分页：极致简约风格 */}
        {!loading && !isSearching && totalPage > 1 && (
          <div className="flex justify-center items-center gap-6 mt-20">
            <Button
              variant="ghost"
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
              disabled={page === 1}
              onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Prev Page
            </Button>
            
            <div className="flex items-center gap-4">
              {Array.from({ length: totalPage }).map((_, index) => {
                const p = index + 1
                const isCurrent = p === page
                return (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`relative w-2 h-2 rounded-full transition-all duration-500 ${
                      isCurrent ? 'bg-orange-500 scale-[2] shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-gray-300 dark:bg-zinc-700 hover:bg-orange-300'
                    }`}
                  />
                )
              })}
            </div>

            <Button
              variant="ghost"
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
              disabled={page === totalPage}
              onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Next Page
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}