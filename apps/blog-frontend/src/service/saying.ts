import { getBaseUrl } from "@/lib/base-url";
import { request } from "./request"
import { ISaying } from "@/types/saying"

export async function getSayings(): Promise<ISaying[]> {
  const res = await request(`${getBaseUrl()}/api/saying`, { method: "GET" })
  const data = await res.json()
  return data.data || []
}

export async function deleteSaying(id: string) {
  const res = await request(`${getBaseUrl()}/api/saying`, {
    method: "DELETE",
     headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({ id })
  })
  return res.json()
}

export async function saveSaying(payload: { id?: string | null; text: string }) {
  const method = payload.id ? "PUT" : "POST"
  const res = await request(`${getBaseUrl()}/api/saying`, {
    method,
     headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify(payload)
  })
  return res.json()
}

