import http from '@/services/http'

const getMoments = () => {
  return http.get('/moments')
}

export {
  getMoments,
}