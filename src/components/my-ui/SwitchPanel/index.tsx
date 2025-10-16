'use client'
import React, { useState } from 'react'

export interface INavItem {
    key: string
    label: string
    component: React.ReactNode
}
interface IProps {
    navItems: INavItem[]
}
export default function SwitchPanel({ navItems }: IProps) {
    type Mode = typeof navItems[number]['key']
    const [mode, setMode] = useState<Mode>(navItems[0].key)
    const handleClickNavBar = (newMode: Mode) => {
        setMode(newMode)
    }

    return (
        <>
            {/* 顶部导航栏 */}
            <div className="w-full border-b border-gray-200 dark:border-gray-700">
                <ul className="flex gap-4 mt-10 pb-2 overflow-x-auto no-scrollbar">
                    {navItems.map((item) => (
                        <li
                            key={item.key}
                            onClick={() => handleClickNavBar(item.key)}
                            className={`px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 ${mode === item.key
                                ? 'bg-blue-500 text-white shadow-sm hover:bg-blue-600 hover:shadow-md'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 内容区 */}
            <div className="w-full h-full flex text-lg font-medium">
                <div className='w-full'>
                    {navItems.find(item => item.key === mode)?.component}
                </div>
            </div>
        </>
    )
}
