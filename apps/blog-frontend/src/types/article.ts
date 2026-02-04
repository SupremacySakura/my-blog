import { IUser } from "./user"

// 文章类型接口
export interface IArticleItem {
    _id: string
    head: string
    digest: string
    article: string
    time: string
    cover: string
    tags: ITag[]
    user: IUser
    visit: number
}

export interface ITag {
    _id: string
    tag: string
}