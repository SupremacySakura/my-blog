import { ILabel } from '@/types/label'
import React from 'react'

export default function LabelCard({ label }: { label: ILabel[] }) {
  return (
        <section className="w-full rounded-[2rem] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/40 dark:border-white/5 p-6 shadow-xl">
            <h2 className="mb-6 text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="text-orange-500">🏷️</span> 标签云
            </h2>

            <div className="flex flex-wrap gap-2">
                {label.map((item) => (
                    <span
                        key={item._id}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-110 hover:rotate-2 border border-white/20 shadow-sm"
                        style={{
                            color: item.color || '#3b82f6',
                            backgroundColor: `${item.backgroundColor}` || 'rgba(59,130,246,0.1)',
                        }}
                    >
                        #{item.text}
                    </span>
                ))}
            </div>
        </section>
    )
}
