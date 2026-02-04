'use client'
import React from 'react'
import { useEffect, useState } from "react"
export default function TypeWriter(params: { wordList: string[] }) {
    const [nowNumber, setNowNumber] = useState(0)
    const [text, setText] = useState("")
    /**
     * 单词逐渐显现再逐渐消失
     * @param word 单词
     * @returns 是否显示完成
     */
    const showWord = (word: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            let i = 0
            let deleting = false
            let lastTime = performance.now()
            const typingDelay = 150 // 打字间隔 (ms)

            const step = (time: number) => {
                if (time - lastTime < typingDelay) {
                    requestAnimationFrame(step)
                    return
                }
                lastTime = time

                if (!deleting) {
                    setText(word.slice(0, i + 1))
                    i++
                    if (i > word.length) {
                        deleting = true
                    }
                } else {
                    setText(word.slice(0, i))
                    i--
                    if (i < 0) {
                        resolve(true)
                        return
                    }
                }

                requestAnimationFrame(step)
            }

            requestAnimationFrame(step)
        })
    }
    useEffect(() => {
        (async () => {
            const res = await showWord(params.wordList[nowNumber % params.wordList.length])
            if (res) {
                const timer = setTimeout(() => {
                    setNowNumber(nowNumber + 1)
                    clearTimeout(timer)
                }, 1000)
            }
        })()
    }, [nowNumber])
    return (
        <h1 className="text-2xl font-mono">
            {text}
            <span className="animate-pulse">|</span>
        </h1>
    )
}
