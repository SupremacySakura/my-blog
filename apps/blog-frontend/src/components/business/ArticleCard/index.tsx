import { IArticleItem } from '@/types/article'
import Link from 'next/link'
import React from 'react'

export default function ArticleCard({ article }: { article: IArticleItem }) {
    const formatDate = (time: string) => {
        const date = new Date(time)
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    return (
        <article
            className="
                relative
                w-full
                rounded-xl
                bg-white/80 dark:bg-zinc-800/60
                border border-gray-200/60 dark:border-zinc-700/60
                transition-all
                hover:-translate-y-0.5 hover:shadow-md
                overflow-hidden
                group
            "
        >
            {/* 整卡可点击的 Link 覆盖层 */}
            <Link
                href={`/article/${article._id}`}
                className="absolute inset-0 z-10"
                aria-label={`阅读文章：${article.head}`}
            />

            {/* 内容容器 */}
            <div className="flex flex-col sm:flex-row relative z-0">
                {/* 封面图 */}
                <div
                    className="
                        w-full h-40
                        sm:w-40 sm:h-auto
                        flex-shrink-0
                        overflow-hidden
                        bg-gray-100 dark:bg-zinc-700
                    "
                >
                    <img
                        src={article.cover}
                        alt={article.head}
                        className="
                            w-full h-full
                            object-cover
                            transition-transform
                            group-hover:scale-105
                        "
                    />
                </div>

                {/* 文本内容 */}
                <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
                    {/* 作者 & 时间 */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <img
                            src={article.user?.avatar}
                            alt=""
                            className="w-5 h-5 rounded-full"
                        />
                        <span className="text-gray-900 dark:text-gray-100">
                            {article.user?.username}
                        </span>
                        <span className="opacity-50">•</span>
                        <time dateTime={article.time}>
                            {formatDate(article.time)}
                        </time>
                    </div>

                    {/* 标题 */}
                    <h3
                        className="
                            text-base sm:text-lg
                            font-semibold
                            tracking-tight
                            text-gray-900 dark:text-white
                            line-clamp-2
                        "
                    >
                        {article.head}
                    </h3>

                    {/* 摘要 */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 sm:line-clamp-3">
                        {article.digest}
                    </p>

                    {/* 元信息 */}
                    <div className="flex items-center flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mt-auto">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>{article.tags?.[0]?.tag || '文章'}</span>
                        </span>
                        <span>•</span>
                        <span>阅读 {article.visit || 0}</span>
                    </div>

                    {/* 标签（不阻断点击） */}
                    <ul className="flex flex-wrap gap-2 mt-2">
                        {article.tags?.map((item) => (
                            <li
                                key={item._id}
                                className="
                                    text-xs px-2 py-1 rounded-md
                                    bg-blue-50 dark:bg-blue-900/20
                                    text-blue-700 dark:text-blue-300
                                    border border-blue-200 dark:border-blue-800
                                "
                            >
                                {item.tag}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    )
}
