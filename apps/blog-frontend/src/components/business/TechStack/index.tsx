'use client'
import { ITechnology } from '@/types/technology'
import React from 'react'

interface IParams {
    techList: ITechnology[]
}

export default function TechStack({ techList }: IParams) {
    const technologyList = [...techList, ...techList]

    return (
        <section className="group relative w-full rounded-[2rem] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/40 dark:border-white/5 p-6 overflow-hidden shadow-xl">
            <h2 className="mb-6 text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="text-blue-500">🧰</span> 技术栈
            </h2>

            <div className="relative flex items-center overflow-hidden h-24">
                {/* 左右渐隐遮罩 */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/40 dark:from-zinc-900/40 to-transparent z-20" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/40 dark:from-zinc-900/40 to-transparent z-20" />

                <ul className="flex items-center animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused]">
                    {technologyList.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => window.open(item.src, '_blank')}
                            className="mx-3 flex flex-col items-center justify-center min-w-[80px] rounded-2xl bg-white/60 dark:bg-zinc-800/60 border border-white/40 dark:border-white/5 p-3 cursor-pointer transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/10"
                        >
                            <img src={item.icon} alt={item.text} className="w-10 h-10 object-contain" />
                            <span className="mt-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                                {item.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}