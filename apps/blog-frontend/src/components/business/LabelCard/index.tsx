import { ILabel } from '@/types/label'
import React from 'react'

export default function LabelCard({ label }: { label: ILabel[] }) {
    return (
        <section
            className="
                w-full rounded-2xl
                bg-white/70 dark:bg-zinc-900/60
                backdrop-blur-md
                border border-gray-200/60 dark:border-zinc-700/60
                p-4 sm:p-6
                shadow-sm
            "
        >
            <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                🏷️ 标签
            </h2>

            <ul className="flex flex-wrap gap-2 sm:gap-3">
                {label.map((item) => (
                    <li
                        key={item._id}
                        className="
                            px-3 py-1.5
                            rounded-full
                            text-sm
                            leading-none
                            border
                            transition-all
                            cursor-default
                            hover:-translate-y-0.5 hover:shadow-sm
                        "
                        style={{
                            color: item.color ?? undefined,
                            backgroundColor: item.backgroundColor
                                ? `${item.backgroundColor}`
                                : undefined,
                        }}
                    >
                        {item.text}
                    </li>
                ))}
            </ul>
        </section>
    )
}
