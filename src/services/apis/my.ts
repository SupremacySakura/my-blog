import http from '@/services/http'

const getMyInformation = () => {
  return http.get('/my')
}
const getMyLabels = () =>{
  return http.get('/my/labels')
}
export {
  getMyInformation,
  getMyLabels,
}