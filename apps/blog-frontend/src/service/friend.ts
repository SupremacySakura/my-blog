import { request } from "./request"
import { INotice } from "@/types/notice"
import { IFriend } from "@/types/friend"

export async function getFriendNotice(): Promise<INotice[]> {
  try {
    const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend/notice`, { method: "GET" })
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export async function getFriendList(): Promise<IFriend[]> {
  try {
    const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend`, { method: "GET" })
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export async function applyFriend(payload: { name: string; label: string; url: string }) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function getAllFriends(): Promise<IFriend[]> {
  try {
    const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend?needAll=${true}`, { method: "GET" })
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export async function deleteFriend(id: string) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend`, {
    method: "DELETE",
    body: JSON.stringify({ id })
  })
  return res.json()
}

export async function updateFriendStatus(id: string, status: number) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend`, {
    method: "PUT",
    body: JSON.stringify({ id, status })
  })
  return res.json()
}
