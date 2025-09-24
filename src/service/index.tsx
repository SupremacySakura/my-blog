import { IArticleItem } from "@/types/article"

/**
 * 获取文章
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 文章数组
 */
export async function getArticle(page: number = 1, pageSize: number = 4): Promise<IArticleItem[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article?page=${page}&pageSize=${pageSize}`, { method: "GET" })
        const data = await res.json()
        return data.data
    } catch (error) {
        return []
    }
}