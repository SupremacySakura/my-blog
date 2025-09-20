import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(request:Request) {
    const client = await clientPromise
    const db = client.db("MyBlog")
    const owner = await db.collection("user").findOne({
        role:'owner'
    })
    const data = {
        code:0,
        data:owner,
        messgage:'获取成功'
    }
   return NextResponse.json(data)
}