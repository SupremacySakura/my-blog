import { request } from "./request"

export async function getColors() {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/color`, { method: "GET" })
  const data = await res.json()
  return data.data || []
}

export async function deleteColor(id: string) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/color`, {
    method: "DELETE",
     headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({ id })
  })
  return res.json()
}

export async function saveColor(payload: { id?: string | null; color: string; comment?: string }) {
  const method = payload.id ? "PUT" : "POST"
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/color`, {
    method,
     headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify(payload)
  })
  return res.json()
}

