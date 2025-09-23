import { IUser } from '@/types/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type UserStore = {
    user: IUser | null
    token: string
    refresh_token: string
    owner_token: string
    loginType: string
    setUser: (user: IUser) => void
    setToken: (token: string) => void
    setRefreshToken: (refresh_token: string) => void
    setOwnerToken: (owner_token: string) => void
    setLoginType: (loginType: string) => void
    logout: () => void
    isLogin: () => boolean
}

export const useUserStore = create<UserStore>()(persist((set, get) => {
    return {
        user: null,
        token: '',
        refresh_token: '',
        owner_token: '',
        loginType: '',
        isLogin: () => get().user?._id ? true : false,
        setUser: (user: IUser) => set(() => ({ user })),
        setToken: (token: string) => set(() => ({ token })),
        setRefreshToken: (refresh_token: string) => set(() => ({ refresh_token })),
        setOwnerToken: (owner_token: string) => set(() => ({ owner_token })),
        setLoginType: (loginType: string) => set(() => ({ loginType })),
        logout: () => {
            set(() => ({ user: null, token: '', refresh_token: '', owner_token: '', loginType: '' }))
        }
    }
}, { name: 'user-store' }))