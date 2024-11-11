//导入vue相关api
import { ref } from 'vue'
//导入pinia相关api
import { defineStore } from 'pinia'
//导入类型
import type { iArticleItem } from '@/types'

export const useArticlesStore = defineStore('articles', () => {
  const _articlesList = ref<iArticleItem[]>([])
  const _setArticlesList = (item: iArticleItem[]) => {
    _articlesList.value = item
  }
  return {
    _articlesList,
    _setArticlesList,
  }
}, {
  persist: true
})
