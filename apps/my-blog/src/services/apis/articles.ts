import { enhanceRequest } from '@/services/enhanceRequest'

// 请求文章
const getArticles = (page: number, keyWord: string | null = null, tagIdList: number[] | null = null) => {
  return enhanceRequest({
    url: '/api/articles',
    method: 'GET',
    params: {
      page: page,
      keyWord: keyWord,
      tagIdList: tagIdList
    },
  })
}
// 请求文章数量
const getArticlesNum = (keyWord: string | null = null, tagIdList: number[] | null = null) => {
  return enhanceRequest({
    url: '/api/articles/number',
    method: 'GET',
    params: {
      keyWord: keyWord,
      tagIdList: tagIdList
    },
  })
}
// 请求文章标签
const getArticleTag = () => {
  return enhanceRequest({
    url: '/api/articles/tag',
    method: 'GET',
  })
}
export {
  getArticles,
  getArticlesNum,
  getArticleTag
}