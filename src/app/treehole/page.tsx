'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import treehole from '../../../public/treehole.png'
import { IMessageItem } from '@/types/message'
import { random } from '@/utils'

export default function Page() {
  const [danmuList, setDanmuList] = useState<IMessageItem[]>([])
  const [page, setPage] = useState(1)
  const showList = useRef<HTMLDivElement[]>([])
  const board = useRef<HTMLDivElement>(null)
  const countRef = useRef(0) // ✅ 用 ref 保存计数

  const getDanmu = async (page: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/message?page=${page}&pageSize=10`
    )
    const data = await res.json()
    setDanmuList(data.data)
    if (page !== 1 && data.data.length <= 0) {
      setPage(1)
    }
  }

  useEffect(() => {
    getDanmu(page)
  }, [page])

  useEffect(() => {
    if (showList.current.length > 0) {
      showList.current.forEach((item) => {
        if (!item) {
          return
        }
        if (!board.current) {
          return
        }
        countRef.current++
        const itemWidth = item.offsetWidth
        const boardWidth = board.current.offsetWidth
        const top = random(10, 90)
        // 初始位置
        item.style.transform = `translate(${boardWidth}px, ${top}vh)`
        const run = () => {
          const anim = item.animate([
            { transform: `translate(${boardWidth}px, ${top}vh)` }, // 从右边
            { transform: `translate(-${itemWidth}px, ${top}vh)` } // 飘到左边
          ], {
            duration: random(4000, 8000),
            delay: random(0, 2000),
            iterations: 1
          })
          if (anim) {
            anim.onfinish = () => {
              countRef.current--
              if (countRef.current <= 0) {
                setPage(page + 1)
                getDanmu(page)
              }
            }
          }
        }
        run()
        // 悬停控制
        item.addEventListener('mouseenter', () => {
          item.getAnimations().forEach((a) => a.pause())
        })
        item.addEventListener('mouseleave', () => {
          item.getAnimations().forEach((a) => a.play())
        })
      })
    }

  }, [danmuList, page]) // ✅ 依赖改为 danmuList

  return (
    <div ref={board} className="relative w-full h-screen overflow-hidden">
      <Image
        src={treehole}
        alt="treehole"
        className="z-[-1] fixed w-full h-screen object-cover object-[right_top]"
      />
      <section className="relative bg-gray-300/50 w-full h-screen pt-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto h-40 flex flex-col items-center justify-center bg-blue-400/40 dark:bg-gray-400/40 rounded-2xl p-4 shadow-md">
          <form className="w-full flex items-center space-x-2"
            onSubmit={(e) => {
              e.preventDefault() // 阻止默认刷新
              console.log('提交逻辑在这里处理')
            }}>
            <input
              type="text"
              placeholder="写下你的留言..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 backdrop-blur-md text-black"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 active:scale-95 transition"
            >
              发送
            </button>
          </form>
          <div className="mt-3 text-sm text-gray-700">输入你的留言</div>
        </div>

        {danmuList.map((item, index) => (
          <div
            className="h-12 inline-flex absolute bg-blue-400 dark:bg-gray-400 rounded-full items-center top-0 left-0"
            key={item._id}
            ref={(el) => {
              if (el) showList.current[index] = el
            }}
          >
            <img
              src={item.user.avatar}
              alt="头像"
              className="h-12 w-12 rounded-full mr-2"
            />
            <span className="mr-1">{item.user.username}:</span>
            <span className='mr-2'>{item.content}</span>
          </div>
        ))}
      </section>
    </div>
  )
}
