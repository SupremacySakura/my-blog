'use client'
import { IStatistics } from '@/types/statistics'
import React, { useEffect, useState } from 'react'
interface IParams {
    statistics: IStatistics
}

export default function StatisticsCard(params: IParams) {
    const [time, setTime] = useState({ hours: '0', minutes: '0', seconds: '0' })
    useEffect(() => {
        const getTime = () => {
            const start = new Date('2025-09-20 00:00:00')
            const diff = new Date().getTime() - start.getTime()
            const hours = Math.floor(diff / 1000 / 60 / 60).toString().padStart(2, '0')
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
            const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2,'0')
            setTime({ hours, minutes, seconds })
            requestAnimationFrame(getTime)
        }
        requestAnimationFrame(getTime)
    }, [])
    return (
        <div className="w-full bg-gray-300/30 p-4 rounded-lg backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4">博客统计</h2>
            <ul className="flex flex-wrap gap-1 justify-between ">
                <li className="flex justify-around items-center p-4 flex-col w-49/100 h-24 bg-blue-300 rounded-lg">
                    <span className="text-2xl font-bold text-blue-500">{params.statistics.articleCount}</span>
                    <span>文章总数</span>
                </li>
                <li className="flex justify-around items-center p-4 flex-col w-49/100 h-24 bg-green-300 rounded-lg">
                    <span className="text-2xl font-bold text-green-500">{params.statistics.visitCount}</span>
                    <span>总访问数</span>
                </li>
                <li className="flex justify-around items-center p-4 flex-col w-49/100 h-24 bg-purple-300 rounded-lg">
                    <span className="text-2xl font-bold text-purple-500">{params.statistics.friendCount}</span>
                    <span>友链数量</span>
                </li>
                <li className="flex justify-around items-center p-4 flex-col w-49/100 h-24 bg-red-300 rounded-lg">
                    <span className="text-2xl font-bold text-red-500">{`${time.hours}:${time.minutes}:${time.seconds}`}</span>
                    <span>本站运行时间</span>
                </li>
            </ul>
        </div>
    )
}
