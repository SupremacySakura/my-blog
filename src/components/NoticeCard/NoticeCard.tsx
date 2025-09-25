import { INotice } from '@/types/notice'
import React from 'react'

export default function NoticeCard({ notice }: { notice: INotice[] }) {
    return (
        <div
            className="
                bg-white/70 dark:bg-gray-800/60 backdrop-blur-md
                p-5 rounded-2xl shadow-md
                transition-all duration-300
            "
        >
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                📢 公告
            </h1>
            <ul className="flex flex-col gap-2">
                {notice.map((item: INotice) => (
                    <li
                        key={item?._id}
                        className="
                            group cursor-pointer p-3 rounded-lg
                            bg-blue-100/50 dark:bg-purple-900/40
                            hover:bg-blue-200/70 dark:hover:bg-purple-800/60
                            transition-colors duration-300
                            flex items-center gap-2
                            "
                    >
                        <span className="text-blue-500 dark:text-purple-400">•</span>
                        <span className="text-gray-800 dark:text-gray-200 truncate lineWith">
                            {item?.notice}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
