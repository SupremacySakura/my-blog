import { request } from "./request"

export async function getLabelsAdmin() {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/label`, { method: "GET" })
  const data = await res.json()
  return data.data || []
}

export async function deleteLabel(id: string) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/label`, {
    method: "DELETE",
    body: JSON.stringify({ id })
  })
  return res.json()
}

export async function saveLabel(payload: { id?: string | null; text: string; color: string; backgroundColor: string }) {
  const method = payload.id ? "PUT" : "POST"
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/label`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return res.json()
}

