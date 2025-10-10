import { verifyOwnerToken } from "@/lib/middleware/auth"
import { NextResponse } from "next/server"
const checkRole = async (request: Request) => {
    return NextResponse.json({
        code: 200,
        message: 'success',
        data: {
            role: 'owner'
        }
    })
}

export const POST = verifyOwnerToken(checkRole)