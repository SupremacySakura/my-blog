import { ref } from 'vue'
import { defineStore } from 'pinia'
//路由接口
interface iTabBarItem {
  id: number,
  text: string,
  path: string,
}
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
  const _optionsWhite = ref({
    lock: true, // 锁定屏幕，禁止操作
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 1)',
  })
  const _pageStart = ref(false)
  const _setPageStart = (boolen: boolean) => {
    _pageStart.value = boolen
  }
  const _nowPath = ref<iTabBarItem>({
    id: 1,
    text: '首页',
    path: '/home'
  })
  const _setNowPath = (item: iTabBarItem) => {
    _nowPath.value = item
  }
  const _theme = ref(false)
  const _setTheme = (boolean: boolean) => {
    _theme.value = boolean
  }
  return {
    _isVisit,
    _setIsVisit,
    _options,
    _optionsWhite,
    _pageStart,
    _setPageStart,
    _nowPath,
    _setNowPath,
    _theme,
    _setTheme,
  }
}, {
  persist: true
})
