import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { IAddress } from "@/types/address"

/**
 * 获取联系方式列表
 * @param request 
 * @returns 联系方式列表
 */
export async function GET(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("MyBlog")
        const address: IAddress[] = await db.collection<IAddress>("address").find().toArray()
        const data= {
            code: 200,
            data: address,
            message: '获取成功'
        }
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: '服务器错误,获取失败',
            error
        })
    }
}