'use client'

import React from 'react'

interface IParams {
  icon: string
  text: string
  url: string
  onClick?: () => void
}

export default function IconMorphButton({
  icon,
  text,
  url,
  onClick,
}: IParams) {
  return (
    <div
      onClick={onClick ?? (() => window.open(url, '_blank'))}
      className="
        group
        relative
        h-12
        w-12 hover:w-44
        rounded-full
        overflow-hidden
        cursor-pointer
        transition-all duration-300
        bg-white/60 dark:bg-zinc-800/60
        backdrop-blur-md
        border border-gray-200/70 dark:border-zinc-700/70
      "
    >
      {/* icon */}
      <div
        className="
          absolute left-0 top-0
          w-12 h-12
          flex items-center justify-center
          rounded-full
          bg-zinc-100 dark:bg-zinc-200
          shadow
        "
      >
        <img
          src={icon}
          alt={text}
          className="w-6 h-6 object-contain"
        />
      </div>

      {/* 文本 */}
      <div className="h-full flex items-center pl-12">
        <span
          className="
            whitespace-nowrap
            text-sm font-medium
            text-gray-700 dark:text-gray-200
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            pr-4
          "
        >
          {text}
        </span>
      </div>
    </div>
  )
}
