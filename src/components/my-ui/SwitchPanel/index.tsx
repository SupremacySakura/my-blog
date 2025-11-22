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
        <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
            {/* 顶部导航栏 */}
            <div className="w-full border-b border-gray-200 dark:border-gray-700 mb-4">
                <ul className="flex gap-2 md:gap-4 mt-4 md:mt-10 pb-2 overflow-x-auto no-scrollbar">
                    {navItems.map((item) => (
                        <li
                            key={item.key}
                            onClick={() => handleClickNavBar(item.key)}
                            className={`px-3 md:px-4 py-2 rounded-xl cursor-pointer text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${mode === item.key
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
                <div className='w-full overflow-x-auto'>
                    {navItems.find(item => item.key === mode)?.component}
                </div>
            </div>
        </div>
    )
}
