import http from '@/services/http'

const getArticles = (page:number) => {
  return http.get('/articles',{params:{
    page:page
  }})
}
const getArticlesNum = () => {
  return http.get('/articles/number')
}

export {
  getArticles,
  getArticlesNum,
}