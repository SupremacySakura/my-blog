import { request } from "./request"

export async function getTechnologiesAdmin() {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/technology`, { method: "GET" })
  const data = await res.json()
  return data.data || []
}

export async function deleteTechnology(id: string) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/technology`, {
    method: "DELETE",
     headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({ id })
  })
  return res.json()
}

export async function saveTechnology(payload: { id?: string | null; text: string; src: string; icon: string; note: string }) {
  const method = payload.id ? "PUT" : "POST"
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/technology`, {
    method,
     headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify(payload)
  })
  return res.json()
}

