import http from '@/services/http'

const getArticles = () => {
  return http.get('/articles')
}

export {
  getArticles
}