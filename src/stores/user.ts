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
    return {
        _token,
        _setToken,
        _setInfo,
        _clearInfo,
        _user,
    }
}, {
    persist: true
})
