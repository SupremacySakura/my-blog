import { IUser } from '@/types/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type UserStore = {
    user: IUser | null
    token: string
    refreshToken: string
    ownerToken: string
    loginType: string
    setUser: (user: IUser) => void
    setToken: (token: string) => void
    setRefreshToken: (refreshToken: string) => void
    setOwnerToken: (ownerToken: string) => void
    setLoginType: (loginType: string) => void
    logout: () => void
    isLogin: () => boolean
}

export const useUserStore = create<UserStore>()(persist((set, get) => {
    return {
        user: null,
        token: '',
        refreshToken: '',
        ownerToken: '',
        loginType: '',
        isLogin: () => get().user?._id ? true : false,
        setUser: (user: IUser) => set(() => ({ user })),
        setToken: (token: string) => set(() => ({ token })),
        setRefreshToken: (refreshToken: string) => set(() => ({ refreshToken })),
        setOwnerToken: (ownerToken: string) => set(() => ({ ownerToken })),
        setLoginType: (loginType: string) => set(() => ({ loginType })),
        logout: () => {
            set(() => ({ user: null, token: '', refreshToken: '', ownerToken: '', loginType: '' }))
        }
    }
}, { name: 'user-store' }))