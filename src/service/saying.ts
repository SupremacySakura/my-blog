import { request } from "./request"
import { ISaying } from "@/types/saying"

export async function getSayings(): Promise<ISaying[]> {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`, { method: "GET" })
  const data = await res.json()
  return data.data || []
}

export async function deleteSaying(id: string) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`, {
    method: "DELETE",
    body: JSON.stringify({ id })
  })
  return res.json()
}

export async function saveSaying(payload: { id?: string | null; text: string }) {
  const method = payload.id ? "PUT" : "POST"
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`, {
    method,
    body: JSON.stringify(payload)
  })
  return res.json()
}

