'use client'
import { IFriend } from '@/types/friend'
import React from 'react'

export default function FriendCard({ friend }: { friend: IFriend }) {
    return (
        <div
            className="
                w-80 h-60 rounded-2xl flex flex-col items-center justify-around p-5
                bg-white/60 dark:bg-gray-800/60 backdrop-blur-md
                shadow-md hover:shadow-xl
                transition-all duration-300 transform hover:scale-105
                cursor-pointer
            "
            onClick={() => window.open(friend?.url)}
        >
            <img
                src={friend?.user?.avatar}
                alt={friend?.name}
                className="w-20 h-20 rounded-full border-2 border-blue-400 dark:border-blue-500 shadow-sm"
            />
            <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {friend?.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {friend?.label}
                </span>
            </div>
        </div>
    )
}
