'use client'
import { IStatistics } from '@/types/statistics'
import React, { useEffect, useState } from 'react'

interface IParams {
    statistics: IStatistics
}

export default function StatisticsCard({ statistics }: IParams) {
    const [time, setTime] = useState({
        years: '0',
        months: '00',
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    })

    useEffect(() => {
        const start = new Date('2025-09-20 00:00:00')

        const tick = () => {
            const now = new Date()
            if (now < start) return requestAnimationFrame(tick)

            let temp = new Date(start)
            let y = 0, m = 0, d = 0

            while (new Date(temp.setFullYear(temp.getFullYear() + 1)) <= now) y++
            temp.setFullYear(temp.getFullYear() - 1)

            while (new Date(temp.setMonth(temp.getMonth() + 1)) <= now) m++
            temp.setMonth(temp.getMonth() - 1)

            while (new Date(temp.setDate(temp.getDate() + 1)) <= now) d++
            temp.setDate(temp.getDate() - 1)

            const diff = now.getTime() - temp.getTime()

            setTime({
                years: String(y),
                months: String(m).padStart(2, '0'),
                days: String(d).padStart(2, '0'),
                hours: String(Math.floor(diff / 3600000)).padStart(2, '0'),
                minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
                seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
            })

            requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
    }, [])

    return (
        <section
            className="
                w-full rounded-2xl
                bg-white/70 dark:bg-zinc-900/60
                backdrop-blur-md
                border border-gray-200/60 dark:border-zinc-700/60
                p-4 sm:p-6
                shadow-sm
            "
        >
            <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                📊 博客统计
            </h2>

            <ul
                className="
                    grid gap-4
                    grid-cols-1
                    sm:grid-cols-2
                "
            >
                <StatItem
                    label="文章总数"
                    value={statistics.articleCount}
                    color="blue"
                />
                <StatItem
                    label="总访问数"
                    value={statistics.visitCount}
                    color="green"
                />
                <StatItem
                    label="友链数量"
                    value={statistics.friendCount}
                    color="purple"
                />

                {/* 运行时间 */}
                <li
                    className="
                        sm:col-span-2
                        flex flex-col justify-center
                        rounded-xl
                        bg-gray-50/70 dark:bg-zinc-800/50
                        border border-gray-200/60 dark:border-zinc-700/60
                        p-4
                    "
                >
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        本站运行时间
                    </span>
                    <span className="font-mono text-sm text-gray-700 dark:text-gray-200">
                        {`${time.years}年${time.months}月${time.days}日 ${time.hours}:${time.minutes}:${time.seconds}`}
                    </span>
                </li>
            </ul>
        </section>
    )
}

function StatItem({
    label,
    value,
    color
}: {
    label: string
    value: number
    color: 'blue' | 'green' | 'purple'
}) {
    const colorMap = {
        blue: `
            text-blue-600 dark:text-blue-400
            bg-blue-50/70 dark:bg-blue-900/20
        `,
        green: `
            text-green-600 dark:text-green-400
            bg-green-50/70 dark:bg-green-900/20
        `,
        purple: `
            text-purple-600 dark:text-purple-400
            bg-purple-50/70 dark:bg-purple-900/20
        `
    }

    return (
        <li
            className={`
                rounded-xl p-4
                flex flex-col justify-center
                transition-all
                hover:-translate-y-0.5 hover:shadow-md
                ${colorMap[color]}
            `}
        >
            <span className="text-2xl font-bold leading-tight">
                {value}
            </span>
            <span className="text-sm mt-1 opacity-70">
                {label}
            </span>
        </li>
    )
}
