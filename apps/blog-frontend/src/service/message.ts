import { request } from "./request"
import { IMessageItem } from "@/types/message"

export async function sendMessage(content: string) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/message`, {
    method: "POST",
    body: JSON.stringify({ content })
  })
  return res.json()
}

export async function getMessages(page: number, pageSize: number = 10): Promise<IMessageItem[]> {
  try {
    const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/message?page=${page}&pageSize=${pageSize}`)
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export async function countMessages(): Promise<number> {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/message/count`)
  const data = await res.json()
  return data.data || 0
}

export async function deleteMessage(id: string) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/message`, {
    method: "DELETE",
    body: JSON.stringify({ id })
  })
  return res.json()
}
