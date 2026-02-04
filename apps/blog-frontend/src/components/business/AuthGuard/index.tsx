'use client'
import { checkOwnerRole } from "@/service"
import { useUserStore } from "@/store/user"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import style from './index.module.css'
export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { ownerToken } = useUserStore()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        (async () => {
            const data = await checkOwnerRole()
            if (data.code !== 200) {
                router.replace(`${process.env.NEXT_PUBLIC_SITE_URL}`)
            }
            setChecking(false)
        })()
    }, [ownerToken, router])
    return (
        <>
            {checking &&
                (<div className='flex justify-center items-center h-screen'>
                    <div className={style.loader}></div>
                </div>)}
            {!checking && children}
        </>)
}
