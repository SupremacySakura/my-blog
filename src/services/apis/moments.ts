import http from '@/services/http'

const getMoments = () => {
  return http.get('/moments')
}
const getTechnology = () => {
  return http.get('/moments/technology')
}
export {
  getMoments,
  getTechnology,
}