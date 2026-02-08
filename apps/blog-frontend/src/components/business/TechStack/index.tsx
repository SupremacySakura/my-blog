'use client'
import { ITechnology } from '@/types/technology'
import React from 'react'

interface IParams {
    techList: ITechnology[]
}

export default function TechStack({ techList }: IParams) {
    const handleClick = (url: string) => {
        window.open(url, '_blank')
    }

    // 用于无缝滚动
    const technologyList = [...techList, ...techList]

    return (
        <section
            className="
                relative w-full
                rounded-2xl
                bg-white/70 dark:bg-zinc-900/60
                backdrop-blur-md
                border border-gray-200/60 dark:border-zinc-700/60
                p-4 sm:p-6
                overflow-hidden
            "
        >
            <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                🧰 技术栈
            </h2>

            {/* 渐隐遮罩 */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/80 dark:from-zinc-900/80 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/80 dark:from-zinc-900/80 to-transparent z-10" />

            <ul
                className="
                    absolute left-0 flex items-center
                    animate-marquee pause-hover
                "
            >
                {technologyList.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => handleClick(item.src)}
                        className="
                            mx-2
                            flex flex-col items-center justify-center
                            rounded-xl
                            bg-white/60 dark:bg-zinc-800/50
                            border border-gray-200/50 dark:border-zinc-700/50
                            p-3
                            cursor-pointer
                            transition-all
                            hover:-translate-y-0.5 hover:shadow-md hover:scale-[1.03]
                        "
                    >
                        <img
                            src={item.icon}
                            alt={item.text}
                            className="
                                w-10 h-10 sm:w-12 sm:h-12
                                rounded-lg
                                object-contain
                            "
                        />
                        <span className="mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {item.text}
                        </span>
                    </li>
                ))}
            </ul>

            {/* 占位高度，保证容器撑开 */}
            <div className="h-24 sm:h-28" />
        </section>
    )
}
