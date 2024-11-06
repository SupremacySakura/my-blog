import http from '@/services/http'

const getFriends = () => {
  return http.get('/friends')
}

export {
  getFriends,
}