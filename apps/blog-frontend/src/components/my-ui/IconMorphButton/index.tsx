'use client'

import React from 'react'

interface IParams {
  icon: string
  text: string
  url: string
  onClick?: () => void
}


export default function IconMorphButton({ icon, text, url, onClick }: IParams) {
  return (
    <div
      onClick={onClick ?? (() => window.open(url, '_blank'))}
      className="group relative h-12 w-12 hover:w-44 rounded-full overflow-hidden cursor-pointer transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) bg-white/70 dark:bg-zinc-800/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-blue-500/20"
    >
      <div className="absolute left-1 top-1 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 shadow-sm z-10 transition-transform group-hover:rotate-[360deg] duration-700">
        <img src={icon} alt={text} className="w-5 h-5 object-contain" />
      </div>

      <div className="h-full flex items-center pl-14">
        <span className="whitespace-nowrap text-sm font-bold text-gray-700 dark:text-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
          {text}
        </span>
      </div>
    </div>
  )
}