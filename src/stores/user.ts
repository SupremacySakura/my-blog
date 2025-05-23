import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { iUser } from "@/types"
export const useUserStore = defineStore('user', () => {
    const _token = ref('')
    const _user = ref<iUser | null>(null)
    const _setToken = (token: string) => {
        _token.value = token
    }
    const _setInfo = (user: iUser) => {
        _user.value = user
    }
    const _clearInfo = () => {
        _token.value = ''
        _user.value = null
    }
    const _checkLogin = (): boolean => {
        if (!_user.value || !_token.value || !_user.value.uid) {
            return false
        }
        return true
    }
    return {
        _token,
        _setToken,
        _setInfo,
        _clearInfo,
        _user,
        _checkLogin,
    }
}, {
    persist: true
})
