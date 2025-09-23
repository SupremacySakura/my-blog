'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ModeToggle } from '../ThemeMode'
import favicon from '@/app/favicon.ico'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useUserStore } from '@/store/user'
export default function NavBar() {
    const pathname = usePathname()
    const userStore = useUserStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])
    const list = [
        { name: '主页', path: '/' },
        { name: '归档', path: '/article' },
        { name: '树洞', path: '/treehole' },
        { name: '关于我', path: '/about' },
    ]
    return (
        <div className='fixed z-[99] flex w-full h-12 justify-between items-center bg-white-300/50 dark:bg-gray-800/50 text-black dark:text-white pl-4 pr-4 backdrop-blur-md backdrop-saturate-50'>
            {/* 左侧 */}
            <div className='flex gap-2 items-center'>
                <Image src={favicon} alt='favicon' width={36} height={36} objectFit='cover'></Image>
                余心知秋的博客
            </div>
            {/* 中间 */}
            <div>
                <ul className='flex gap-4'>
                    {list.map((item) => {
                        const isActive = pathname === item.path
                        return (<li key={item.name} className={`w-20 text-center hover:text-blue-500 hover:bg-blue-200 p-2 rounded-lg transition-colors duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-500' : ''}`}><Link href={item.path}>{item.name}</Link></li>)
                    })}
                </ul>
            </div>
            {/* 右侧 */}
            <div className='flex gap-2 items-center h-full'>
                <ModeToggle></ModeToggle>
                {mounted && !userStore.isLogin() ? (
                    <Link
                        href="/login"
                        className="
                            px-4 py-2 rounded-lg font-medium
                            bg-gradient-to-r from-blue-500 to-blue-600
                            text-white shadow-md
                            hover:from-blue-600 hover:to-blue-700
                            active:scale-95 transition-all duration-300
                            dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900
                            "
                    >
                        <span>登录</span>
                    </Link>
                ) : (
                    <button
                        onClick={() => userStore.logout()}
                        className="
                            px-4 py-2 rounded-lg font-medium
                            bg-gradient-to-r from-red-500 to-red-600
                            text-white shadow-md
                            hover:from-red-600 hover:to-red-700
                            active:scale-95 transition-all duration-300
                            dark:from-red-700 dark:to-red-800 dark:hover:from-red-800 dark:hover:to-red-900
                            "
                    >
                        登出
                    </button>
                )}
            </div>
        </div>
    )
}
