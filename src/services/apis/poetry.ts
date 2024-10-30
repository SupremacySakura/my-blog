import http from '@/services/http'

const getPoetry = () => {
  return http.get('/poetry')
}

export {
  getPoetry
}