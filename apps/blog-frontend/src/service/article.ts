import { request } from "./request"
import { IArticleItem } from "@/types/article"

export async function getArticles(page: number = 1, pageSize: number = 4): Promise<IArticleItem[]> {
  try {
    const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article?page=${page}&pageSize=${pageSize}`, { method: "GET" })
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export async function getArticleUrl(id: string): Promise<string | undefined> {
  try {
    const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/url?id=${id}`, { cache: "no-store" })
    const data = await res.json()
    return data.data?.article
  } catch {
    return undefined
  }
}

export async function visitArticle(id: string): Promise<void> {
  await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: id })
  })
}

export async function countArticles(): Promise<number> {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/count`)
  const data = await res.json()
  return data.data || 0
}

export async function getArticlesPaged(page: number, pageSize: number) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article?page=${page}&pageSize=${pageSize}`)
  const data = await res.json()
  return data.data || []
}

export async function getArticleTags() {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/tag`)
  const data = await res.json()
  return data.data || []
}

export async function deleteArticle(id: string) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
  return res.json()
}

export async function saveArticle(payload: {
  id?: string | null
  head: string
  digest: string
  article: string
  cover: string
  tags: string[]
  user_id: string
}) {
  const method = payload.id ? "PUT" : "POST"
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function deleteTag(id: string) {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/tag`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
  return res.json()
}

export async function saveTag(payload: { id?: string | null; tag: string }) {
  const method = payload.id ? "PUT" : "POST"
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/tag`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return res.json()
}
