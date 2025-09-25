import { IUser } from "./user"

export interface IFriend {
    _id: number
    name: string
    label: string
    url: string
    user: IUser
}