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
        <Link href={`/article/${article._id}`} className='w-full'>
        <div className='w-full h-50 gap-2 bg-white dark:bg-gray-600 p-3 rounded-lg flex'>
            <img src={article.cover} alt="" className='w-65 h-full flex-shrink-0 object-cover rounded-lg'/>
            <section className='flex flex-col gap-1 justify-between'>
                <h1 className='text-lg font-bold overflow-hidden text-ellipsis break-words line-clamp-1'>{article.head}</h1>
                <p className='text-sm overflow-hidden text-ellipsis break-words line-clamp-3'>{article.digest}</p>
                <div className='flex gap-2'>
                    <img src={article.user.avatar} alt="" className='w-6 h-6 rounded-full'/>
                    <span>{article.user.username}</span>
                    <span className='flex items-center pl-2 pr-2 rounded-sm text-xs text-gray-600 bg-gray-300'>{`发布于${formateTime(article.time) }`}</span>  
                    <span className='flex items-center pl-2 pr-2 rounded-sm text-xs text-blue-600 bg-blue-300'>阅读:{article.visit || 0}</span> 
                </div>
                <ul className='flex gap-2'>
                    {article.tags?.map((item) => (<li key={item._id} className='text-xm pl-2 pr-2 pt-1 pb-1 rounded-sm bg-blue-500 text-white text-sm'>{item.tag}</li>))}
                </ul>
            </section>
        </div>
        </Link>
    )
}
