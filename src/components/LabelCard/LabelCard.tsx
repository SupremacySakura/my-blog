import { ILabel } from '@/types/label'
import React from 'react'

export default function LabelCard(params: { label: ILabel[] }) {
  return (
      <div className="w-full bg-gray-300/30 p-4 rounded-lg backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">标签</h2>
          <ul className="w-full flex  flex-wrap gap-4">
              {params.label.map((item) => (<li key={item._id} className="pl-3 pr-3 pt-2 pb-2 rounded-xl" style={{ color: item.color, backgroundColor: item.backgroundColor }}>{item.text}</li>))}
          </ul>
      </div>
  )
}
