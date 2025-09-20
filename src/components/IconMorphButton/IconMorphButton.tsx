'use client'
import React from 'react'
interface IParams{
   icon:string
   text:string
   url:string
   onClick?:()=>void
}
export default function IconMorphButton(params:IParams) {
  return (
    <div onClick={params?.onClick || (()=>{
        window.open(params.url)
    })} className='w-12 h-12 rounded-full overflow-hidden flex hover:w-50 hover:bg-blue-300 duration-300 gap-2 cursor-pointer'>
      <img src={params.icon} alt={params.text} className='w-12 h-12 rounded-full'/>
      <span className='flex items-center justify-center flex-grow h-full mr-6'>{params.text}</span>
    </div>
  )
}
