import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAssetStore = defineStore('asset', () => {
  const _isVisit = ref(true)
  const _setIsVisit = (boolen: boolean) => {
    _isVisit.value = boolen
  }
  const _options = ref({
    lock: true, // 锁定屏幕，禁止操作
    text: '正在加载...(若长时间无法加载出来,请刷新页面)',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 1)',
  })
  return {
    _isVisit,
    _setIsVisit,
    _options,
  }
}, {
  persist: true
})
