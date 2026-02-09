'use client'
import { IFriend } from '@/types/friend'
import React from 'react'

export default function FriendCard({ friend }: { friend: IFriend }) {
    return (
        <div
            className="group relative overflow-hidden rounded-[2rem] p-6 bg-white/60 dark:bg-gray-800/40 backdrop-blur-md border border-white/40 dark:border-gray-700/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
            onClick={() => window.open(friend?.url)}
        >
            {/* 悬停时的渐变光晕 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <img
                        src={friend?.user?.avatar}
                        alt={friend?.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md group-hover:rotate-12 transition-transform duration-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors">
                    {friend?.name}
                </h3>
                
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                    {friend?.label || "这个站长很懒，什么都没留下"}
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 w-full flex justify-center">
                    <span className="text-xs font-mono text-blue-400 dark:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        查看站点 →
                    </span>
                </div>
            </div>
        </div>
    )
}