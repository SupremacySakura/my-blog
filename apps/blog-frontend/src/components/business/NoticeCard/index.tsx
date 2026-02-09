import { INotice } from '@/types/notice'
import React from 'react'

export default function NoticeCard({ notice }: { notice: INotice[] }) {
    if (!notice || notice.length === 0) return null;

    return (
        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-xl">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="animate-pulse">📢</span> 最近公告
            </h1>
            <div className="grid gap-3">
                {notice.map((item: INotice) => (
                    <div
                        key={item?._id}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-all duration-300 border border-transparent hover:border-blue-500/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <span className="text-gray-700 dark:text-gray-200 text-sm md:text-base leading-relaxed">
                            {item?.notice}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}