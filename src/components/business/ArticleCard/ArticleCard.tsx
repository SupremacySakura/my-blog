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
        <Link href={`/article/${article._id}`} className="w-full">
            <div
                className="
          @container w-full gap-2 bg-white dark:bg-gray-600 p-3 rounded-lg flex 
           @md:flex-row relative overflow-hidden
        "
            >
                {/* 小容器：背景图，大容器：左图 */}
                <div
                    className="
            absolute inset-0 bg-cover bg-center 
            @md:static @md:w-64 @md:h-full @md:flex-shrink-0 @md:rounded-lg
          "
                    style={{ backgroundImage: `url(${article.cover})` }}
                >
                    <img
                        src={article?.cover}
                        alt=""
                        className="hidden @md:block w-64 h-full object-cover rounded-lg"
                    />
                </div>

                {/* 遮罩层：仅在容器 <600px 时显示 */}
                <div className="absolute inset-0 bg-black/40 @md:hidden"></div>

                {/* 内容区 */}
                <section
                    className="
            relative z-10 flex flex-col gap-1 justify-between 
            @md:gap-2 @md:pl-3 @md:z-auto
          "
                >
                    <h1 className="text-lg font-bold overflow-hidden text-ellipsis break-words line-clamp-1 text-white @md:text-black dark:@md:text-white">
                        {article?.head}
                    </h1>
                    <p className="text-sm overflow-hidden text-ellipsis break-words line-clamp-3 text-white @md:text-gray-800 dark:@md:text-gray-200">
                        {article?.digest}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <img
                            src={article?.user?.avatar}
                            alt=""
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="text-white @md:text-black dark:@md:text-white">
                            {article?.user?.username}
                        </span>
                        <span className="flex items-center px-2 rounded-sm text-xs text-gray-200 bg-gray-500 @md:text-gray-600 @md:bg-gray-300">
                            {`发布于${formateTime(article.time)}`}
                        </span>
                        <span className="flex items-center px-2 rounded-sm text-xs text-blue-200 bg-blue-600 @md:text-blue-600 @md:bg-blue-300">
                            阅读:{article?.visit || 0}
                        </span>
                    </div>
                    <ul className="flex gap-2 flex-wrap">
                        {article?.tags?.map((item) => (
                            <li
                                key={item._id}
                                className="text-xs px-2 py-1 rounded-sm bg-blue-500 text-white"
                            >
                                {item.tag}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </Link>
    )
}
