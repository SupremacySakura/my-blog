"use client"
import React from 'react'
import Link from 'next/link';
import { ModeToggle } from '../ThemeMode';
export default function NavBar() {
    const list = [
        { name: '主页', path: '/' },
        { name: '归档', path: '/article' },
        { name: '树洞', path: '/treehole' },
        { name: '关于我', path: '/about' },
    ]
    return (
        <div className="flex w-full h-12 justify-between items-center bg-blue-300/50 dark:bg-gray-800/50 text-black dark:text-white pl-4 pr-4">
            {/* 左侧 */}
            <div>余心知秋的博客</div>
            {/* 中间 */}
            <div>
                <ul className="flex gap-4">
                    {list.map((item) => (<li className='hover:text-blue-500 hover:bg-blue-200 p-2 rounded-lg'><Link href={item.path}>{item.name}</Link></li>))}
                </ul>
            </div>
            {/* 右侧 */}
            <div>
                <ModeToggle></ModeToggle>
            </div>
        </div>
    )
}
