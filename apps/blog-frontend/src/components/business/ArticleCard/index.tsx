'use client'
import { IArticleItem } from '@/types/article'
import Link from 'next/link'
import React from 'react'
import { Calendar, Eye, Clock, ArrowRight } from 'lucide-react'

export default function ArticleCard({ article }: { article: IArticleItem }) {
    const formatDate = (time: string) => {
        return new Date(time).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    return (
        <article className="group relative w-full mb-4">
            {/* 极致玻璃材质外壳 */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-orange-500/10 hover:-translate-y-2">

                {/* 隐藏的整卡链接 */}
                <Link
                    href={`/article/${article._id}`}
                    className="absolute inset-0 z-30"
                    aria-label={article.head}
                />

                <div className="flex flex-col md:flex-row p-4 gap-6">
                    {/* 左侧：悬浮内嵌封面图 */}
                    <div className="relative w-full md:w-64 h-52 md:h-60 shrink-0 overflow-hidden rounded-[2rem] shadow-inner">
                        <img
                            src={article.cover}
                            alt={article.head}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-2"
                        />
                        {/* 封面渐变遮罩 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                        {/* 悬浮分类 */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                                {article.tags?.[0]?.tag || 'JOURNAL'}
                            </span>
                        </div>

                        {/* 阅读时间占位（模拟） */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 text-[10px] font-bold">
                            <Clock className="w-3 h-3" />
                            <span>5 MIN READ</span>
                        </div>
                    </div>

                    {/* 右侧：精细化文本内容 */}
                    <div className="flex-1 py-2 flex flex-col">
                        {/* 顶部元数据 */}
                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
                            <div className="flex items-center gap-2">
                                <img src={article.user?.avatar} alt="" className="w-5 h-5 rounded-full border border-orange-500/20 shadow-sm" />
                                <span className="text-gray-900 dark:text-zinc-200">{article.user?.username}</span>
                            </div>
                            <span className="opacity-30">/</span>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(article.time)}
                            </div>
                        </div>

                        {/* 标题 - 增加渐变动画效果 */}
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                            {article.head}
                        </h3>

                        {/* 摘要 */}
                        <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed font-medium">
                            {article.digest}
                        </p>

                        {/* 底部功能区 */}
                        <div className="mt-auto flex items-center justify-between">
                            {/* 标签云 - 药丸风格 */}
                            <div className="flex gap-2">
                                {article.tags?.slice(0, 2).map((t) => (
                                    <span key={t._id} className="text-[10px] px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                                        #{t.tag}
                                    </span>
                                ))}
                            </div>

                            {/* 阅读量 & 箭头交互 */}
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{article.visit || 0} VIEWS</span>
                                </div>
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-[-45deg]">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 背景装饰：微弱的光斑 */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/5 rounded-full blur-[80px] group-hover:bg-orange-500/10 transition-colors" />
            </div>
        </article>
    )
}