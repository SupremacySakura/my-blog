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
        <section className="w-full rounded-[2rem] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/40 dark:border-white/5 p-6 shadow-xl">
            <h2 className="mb-6 text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="text-purple-500">📊</span> 博客统计
            </h2>

            <div className="grid gap-4 grid-cols-2">
                <StatItem label="文章总数" value={statistics.articleCount} color="blue" />
                <StatItem label="总访问数" value={statistics.visitCount} color="green" />
                
                {/* 运行时间：增强为 Dark Mode 代码风格 */}
                <div className="col-span-2 mt-2 p-4 rounded-2xl bg-zinc-900 dark:bg-black/40 border border-white/5 shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                        <span className="text-[40px] font-black text-white italic">TIME</span>
                    </div>
                    <span className="text-[10px] text-blue-400 font-mono block mb-2 uppercase tracking-widest">System Running</span>
                    <div className="font-mono text-sm text-white/90 flex justify-between">
                        <span>{time.years}Y {time.months}M {time.days}D</span>
                        <span className="text-blue-400">{time.hours}:{time.minutes}:{time.seconds}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

function StatItem({ label, value, color }: { label: string, value: number, color: 'blue' | 'green' }) {
    const themes = {
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
        green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
    }
    return (
        <div className={`p-4 rounded-2xl border ${themes[color]} transition-all hover:scale-[1.02]`}>
            <span className="text-2xl font-black block">{value}</span>
            <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{label}</span>
        </div>
    )
}