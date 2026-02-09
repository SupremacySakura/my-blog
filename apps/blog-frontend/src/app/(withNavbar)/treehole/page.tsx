'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { IMessageItem } from '@/types/message'
import { random } from '@/utils'
import { toast } from "sonner"
import { sendMessage, getMessages } from '@/service'

export default function Page() {
  const [danmuList, setDanmuList] = useState<IMessageItem[]>([])
  const [content, setContent] = useState('')
  const [page, setPage] = useState(1)
  
  const boardRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const activeAnimations = useRef<Set<Animation>>(new Set())

  // 获取数据
  const getDanmu = useCallback(async (pageNum: number) => {
    try {
      const list = await getMessages(pageNum, 12) // 略微增加每页数量
      if (list.length === 0 && pageNum !== 1) {
        setPage(1) // 如果没数据了回第一页
        return
      }
      setDanmuList(list)
    } catch (error) {
      toast.error('加载弹幕失败')
    }
  }, [])

  // 提交留言
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim()) return
    const data = await sendMessage(content)
    if (data.code === 200) {
      setContent('')
      toast.success('留言成功')
      // 提交后刷新当前页或回到第一页
      setPage(1)
      getDanmu(1)
    }
  }

  // 初始加载及分页监听
  useEffect(() => {
    getDanmu(page)
  }, [page, getDanmu])

  // 动画核心逻辑
  useEffect(() => {
    if (danmuList.length === 0 || !boardRef.current) return

    const boardWidth = boardRef.current.offsetWidth
    let finishedCount = 0

    // 清理旧动画
    activeAnimations.current.forEach(anim => anim.cancel())
    activeAnimations.current.clear()

    danmuList.forEach((item, index) => {
      const el = itemRefs.current.get(item._id)
      if (!el) return

      const itemWidth = el.offsetWidth
      const randomTop = random(10, 80) // 限制在 10% - 80% 避免太靠边
      const duration = random(6000, 10000) // 稍微减慢速度，增加可读性
      const delay = index * 400 // 交错出生，避免堆在一起

      // Web Animations API
      const anim = el.animate([
        { transform: `translate(${boardWidth}px, ${randomTop}vh)`, opacity: 0 },
        { transform: `translate(${boardWidth - 50}px, ${randomTop}vh)`, opacity: 1, offset: 0.1 },
        { transform: `translate(-${itemWidth}px, ${randomTop}vh)`, opacity: 1, offset: 0.9 },
        { transform: `translate(-${itemWidth + 50}px, ${randomTop}vh)`, opacity: 0 }
      ], {
        duration,
        delay,
        fill: 'forwards',
        easing: 'linear'
      })

      activeAnimations.current.add(anim)

      anim.onfinish = () => {
        finishedCount++
        activeAnimations.current.delete(anim)
        // 当本组弹幕有一半以上播放完毕时，尝试加载下一页，保证视觉连续性
        if (finishedCount >= Math.ceil(danmuList.length * 0.8)) {
          setPage(prev => prev + 1)
        }
      }
    })

    return () => {
      activeAnimations.current.forEach(anim => anim.cancel())
      activeAnimations.current.clear()
    }
  }, [danmuList])

  return (
    <div ref={boardRef} className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-slate-900">
      {/* 装饰性背景层 */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full blur-[120px]" />
      </div>

      <section className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {/* 输入框卡片 */}
        <div className="w-full max-w-md bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-2xl transition-all hover:shadow-blue-500/10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">留下你的心声</h2>
          <form className="flex items-center space-x-2" onSubmit={handleSubmit}>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="此刻你在想什么..."
              className="flex-1 px-4 py-3 rounded-2xl border-none bg-white/60 dark:bg-gray-800/60 focus:ring-2 focus:ring-blue-400 dark:text-white outline-none transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
            >
              发送
            </button>
          </form>
          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            已有 {danmuList.length > 0 ? '多条' : '0'} 精彩留言实时滚动中
          </p>
        </div>

        {/* 弹幕渲染层 */}
        {danmuList.map((item) => (
          <div
            key={item._id}
            ref={(el) => {
              if (el) itemRefs.current.set(item._id, el)
              else itemRefs.current.delete(item._id)
            }}
            onMouseEnter={(e) => {
              const anims = e.currentTarget.getAnimations()
              anims.forEach(a => a.pause())
            }}
            onMouseLeave={(e) => {
              const anims = e.currentTarget.getAnimations()
              anims.forEach(a => a.play())
            }}
            className="top-0 left-0 h-10 inline-flex absolute items-center px-1 pr-4 bg-white/70 dark:bg-gray-800/80 backdrop-blur-md border border-white/50 dark:border-gray-700/50 rounded-full shadow-sm cursor-default select-none pointer-events-auto group hover:z-50 hover:border-blue-400 transition-colors"
            style={{ 
              transform: `translate(100vw, 0)`,
              willChange: 'transform, opacity'
            }}
          >
            <img
              src={item.user.avatar}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover border-2 border-white dark:border-gray-600"
            />
            <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-300 whitespace-nowrap">
              {item.user.username}:
            </span>
            <span className="ml-1 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
              {item.content}
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}