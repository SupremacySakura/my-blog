import http from '@/services/http'

const getArticles = () => {
  return http.get('/articles')
}
const getArticlesNum = () => {
  return http.get('/articles/number')
}

export {
  getArticles,
  getArticlesNum,
}