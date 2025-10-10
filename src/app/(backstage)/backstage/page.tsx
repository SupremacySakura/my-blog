'use client'
import TechnologyTable from '@/components/TechnologyTable/TechnologyTable'
import React, { useState } from 'react'

enum Mode {
  Technology = 'technology',
  Tag = 'tag',
}

export default function Page() {
  const [mode, setMode] = useState<Mode>(Mode.Technology)

  // 导航项配置
  const navItems = [
    { key: Mode.Technology, label: '技术栈' },
    { key: Mode.Tag, label: '标签' },
  ]

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
        {mode === Mode.Technology && (
          <div className="text-blue-500">
            <TechnologyTable />
          </div>
        )}
        {mode === Mode.Tag && (
          <div className="text-blue-500">这里是【标签】内容</div>
        )}
      </div>
    </>
  )
}
