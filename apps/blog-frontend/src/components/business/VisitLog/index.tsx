'use client'
import { useEffect } from "react"
import { getClientInfo } from "@/utils/getClientInfo"
import { postVisit } from "@/service"
export default function VisitLog() {
    useEffect(() => {
        const info = getClientInfo()

        postVisit(info)
    }, [])
    return (
        null
    )
}
