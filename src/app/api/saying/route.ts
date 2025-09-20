import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const client = await clientPromise
    const db = client.db("MyBlog")
    const sayings = await db.collection("saying").find().toArray();
    const data = {
        code: 0,
        data: sayings,
        messgage: '获取成功'
    }
    return NextResponse.json(data);
}