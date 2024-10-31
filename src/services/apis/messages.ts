import http from '@/services/http'

const getMessages = () => {
  return http.get('/messages')
}
const postMessages = (params:any) => {
  return http.post('/messages/post',{params:params})
}
export {
  getMessages,
  postMessages,
}