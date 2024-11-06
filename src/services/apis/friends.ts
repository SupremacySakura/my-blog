import http from '@/services/http'

const getFriends = () => {
  return http.get('/articles')
}

export {
  getFriends,
}