import { IUser } from "./user"

// 文章类型接口
export interface IArticleItem {
    _id: number
    head: string
    digest: string
    article: string
    time: string
    cover: string
    tags: {
        _id: string
        tag: string
    }[]
    user: IUser
    visit:number
}