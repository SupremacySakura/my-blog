import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { iUser } from "@/types"
import { checkLogin } from '@/services/apis/login'
export const useUserStore = defineStore('user', () => {
    const _token = ref('')
    const _refreshToken = ref('')
    const _user = ref<iUser | null>(null)
    const _setToken = (token: string) => {
        _token.value = token
    }
    const _setRefreshToken = (refreshToken: string) => {
        _refreshToken.value = refreshToken
    }
    const _setInfo = (user: iUser) => {
        _user.value = user
    }
    const _clearInfo = () => {
        _token.value = ''
        _user.value = null
        _refreshToken.value = ''
    }
    const _checkLogin = async (): Promise<boolean> => {
        try {
            const res = await checkLogin()
            if (res.data.code === 200) {
                return true
            } else {
                return false
            }
        } catch (err) {
            return false
        }
    }
    return {
        _token,
        _setToken,
        _setInfo,
        _clearInfo,
        _user,
        _checkLogin,
        _refreshToken,
        _setRefreshToken,
    }
}, {
    persist: true
})
