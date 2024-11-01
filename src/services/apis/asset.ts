import http from '@/services/http'

const getTime = () => {
  return http.get('/asset/time')
}

const getPeople = ()=>{
  return http.get('/asset/people')
}
const visit = ()=>{
  return http.post('/asset/get')
}
export {
  getTime,
  getPeople,
  visit,
}