import { verifyOwnerToken } from "@/lib/middleware/auth"
import { NextResponse } from "next/server"

/**
 * 检查用户角色
 * @param request 
 * @returns 
 */
const checkRole = async (request: Request) => {
    return NextResponse.json({
        code: 200,
        message: 'success',
        data: {
            role: 'owner'
        }
    })
}
/**
 * 检查用户角色
 * @param request 
 * @returns 
 */
export const POST = verifyOwnerToken(checkRole)