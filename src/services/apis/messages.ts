import http from '@/services/http'

const getMessages = () => {
  return http.get('/messages')
}

const postMessages = (params: any) => {
  return http.post('/messages/post', { 
      userHeadPortrait:params.userHeadPortrait,
      name:params.name,
      content:params.content,
      time:params.time,
      address:params.address,
   })
}
export {
  getMessages,
  postMessages,
}