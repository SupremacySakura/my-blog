import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const _id = ref('')
    const _username = ref('')
    const _token = ref('')
    const _setToken = (token: string) => {
        _token.value = token
    }
    const _setInfo = (id: string, username: string) => {
        _id.value = id
        _username.value = username
    }
    const _clearInfo = () => {
        _id.value = ''
        _username.value = ''
        _token.value = ''
    }
    return {
        _token,
        _setToken,
        _setInfo,
        _id,
        _username,
        _clearInfo,
    }
}, {
    persist: true
})
