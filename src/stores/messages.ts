import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', () => {
  const _userHeadPortrait = ref('')
  const _name = ref('')
  const _address = ref('')
  const _setInfo = (userHeadPortrait: string, name: string, address?: string) => {
    _userHeadPortrait.value = userHeadPortrait
    _name.value = name
    if (address) {
      _address.value = address
    }
  }
  return {
    _userHeadPortrait,
    _name,
    _address,
    _setInfo,
  }
}, {
  persist: true
})
