'use client'
import { useEffect } from "react"
import { getClientInfo } from "@/utils/getClientInfo"
export default function VisitLog() {
    useEffect(() => {
        const info = getClientInfo()

        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/visit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...info
            })
        })
    }, [])
    return (
        null
    )
}
