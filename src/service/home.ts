import { request } from "./request"
import { ISaying } from "@/types/saying"
import { IUser } from "@/types/user"
import { IAddress } from "@/types/address"
import { ILabel } from "@/types/label"
import { ITechnology } from "@/types/technology"
import { IStatistics } from "@/types/statistics"

export async function getSayingList(): Promise<ISaying[]> {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`, { method: "GET" })
  const data = await res.json()
  return data.data || []
}

export async function getOwner(): Promise<IUser> {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/owner`, { method: "GET" })
  const data = await res.json()
  return data.data
}

export async function getAddressList(): Promise<IAddress[]> {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/address`, { method: "GET" })
  const data = await res.json()
  return data.data || []
}

export async function getLabels(): Promise<ILabel[]> {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/label`, { method: "GET" })
  const data = await res.json()
  return data.data || []
}

export async function getTechnologies(): Promise<ITechnology[]> {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/technology`, { method: "GET" })
  const data = await res.json()
  return data.data || []
}

export async function getStatistics(): Promise<IStatistics> {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/statistics`, { method: "GET" })
  const data = await res.json()
  return data.data
}

