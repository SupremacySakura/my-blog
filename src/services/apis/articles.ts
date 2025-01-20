import { enhanceRequest } from '@/services/enhanceRequest'

const getArticles = (page: number, keyWord: string | null = null, tagIdList: number[] | null = null) => {
  return enhanceRequest({
    url: '/articles',
    method: 'GET',
    params: {
      page: page,
      keyWord: keyWord,
      tagIdList: tagIdList
    },
  })
}
const getArticlesNum = (keyWord: string | null = null, tagIdList: number[] | null = null) => {
  return enhanceRequest({
    url: '/articles/number',
    method: 'GET',
    params: {
      keyWord: keyWord,
      tagIdList: tagIdList
    },
  })
}
const getArticleTag = () => {
  return enhanceRequest({
    url: '/articles/tag',
    method: 'GET',
  })
}
export {
  getArticles,
  getArticlesNum,
  getArticleTag
}