import { IUser } from "./user"

// 评论类型接口
export interface IMessageItem {
    _id: string
    content: string
    time: string
    user: IUser
}