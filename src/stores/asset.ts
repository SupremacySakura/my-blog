import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAssetStore = defineStore('asset', () => {
  const _isVisit = ref(true)
  const _setIsVisit = (boolen: boolean) => {
    _isVisit.value = boolen
  }
  return { _isVisit, _setIsVisit }
}, {
  persist: true
})
