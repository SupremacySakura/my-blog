import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
//创建文章类
interface iArticleItem {
  id: number,
  head: string,
  digest: string,
  article: string,
  userHeadPortrait: string,
  name: string,
  time: string,
  cover: string
}
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
