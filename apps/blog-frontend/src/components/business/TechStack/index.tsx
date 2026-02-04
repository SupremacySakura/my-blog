'use client'
import { ITechnology } from '@/types/technology'
import React from 'react'

interface IParams {
    techList: ITechnology[]
}

export default function TechStack(params: IParams) {
    const handleClick = (url: string) => {
        window.open(url, '_blank')
    }

    const technologyList = [...params.techList, ...params.techList]
    return (
        <div className="w-full p-4 bg-gray-300/30 backdrop-blur-md rounded-lg relative overflow-hidden">
            <h2 className='text-xl font-bold mb-4'>技术栈</h2>
            <ul className="left-0 flex absolute animate-marquee pause-hover">
                {technologyList.map((item, index) => (
                    <li key={index}
                        onClick={() => handleClick(item.src)}
                        className="p-2 mx-2 my-2 flex justify-center flex-col items-center rounded-lg bg-white/30 cursor-pointer"
                    >
                        <img src={item.icon} alt="" className="w-12 h-12 rounded-lg" />
                        <span>{item.text}</span>
                    </li>
                ))}
            </ul>
            {/* 占位容器 */}
            <div className='p-2 mx-2 my-2 w-12 h-20'></div>
        </div>
    )
}
