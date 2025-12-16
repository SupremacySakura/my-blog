import { IArticleItem } from '@/types/article'
import Link from 'next/link'
import React from 'react'

export default function ArticleCard(params: { article: IArticleItem }) {
    const { article } = params
    const formateTime = (time: string) => {
        const date = new Date(time)
        return date.toLocaleDateString()
    }

    return (
        <div className="@container w-full bg-white dark:bg-gray-800 p-4 rounded-xl ring-1 ring-gray-200/70 dark:ring-white/10 hover:shadow-md transition-all duration-200 flex justify-between gap-4">
            <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs @md:text-sm">
                    <img src={article?.user?.avatar} alt="" className="w-5 h-5 @md:w-6 @md:h-6 rounded-full" />
                    <span className="text-gray-900 dark:text-white">{article?.user?.username}</span>
                    <span className="text-gray-300 dark:text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{formateTime(article.time)}</span>
                </div>
                <Link href={`/article/${article._id}`} className="group">
                    <h2 className="text-base @md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-1 group-hover:underline">
                        {article?.head}
                    </h2>
                </Link>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 @md:line-clamp-3">
                    {article?.digest}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>{article?.tags?.[0]?.tag || '文章'}</span>
                    </span>
                    <span>•</span>
                    <span>阅读 {article?.visit || 0}</span>
                </div>
                <ul className="flex gap-2 flex-wrap">
                    {article?.tags?.map((item) => (
                        <li key={item._id} className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800">
                            {item.tag}
                        </li>
                    ))}
                </ul>
            </div>
            <Link href={`/article/${article._id}`} className="hidden @md:block flex-shrink-0 self-center">
                <img src={article?.cover} alt="" className="w-40 h-24 rounded-lg object-cover" />
            </Link>
        </div>
    )
}
