import { enhanceRequest } from '@/services/enhanceRequest'

const getArticles = (page: number) => {
  return enhanceRequest({
    url: '/articles',
    method: 'GET',
    params: {
      page: page
    },
  })
}
const getArticlesNum = () => {
  return enhanceRequest({
    url: '/articles/number',
    method: 'GET',
  })
}
export {
  getArticles,
  getArticlesNum,
}