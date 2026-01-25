'use client'
import http from "@/lib/http"
import { useUserStore } from "@/store/user"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import style from './index.module.css'
export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { owner_token } = useUserStore()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        (async () => {
            const res = await http.fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/login/checkRole`, { method: 'POST' })
            const data = await res.json()
            if (data.code !== 200) {
                router.replace("/")
            }
            setChecking(false)
        })()
    }, [owner_token, router])
    return (
        <>
            {checking &&
                (<div className='flex justify-center items-center h-screen'>
                    <div className={style.loader}></div>
                </div>)}
            {!checking && children}
        </>)
}
