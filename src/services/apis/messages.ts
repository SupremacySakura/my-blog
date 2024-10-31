import http from '@/services/http'

const getMessages = () => {
  return http.get('/messages')
}

export {
  getMessages
}