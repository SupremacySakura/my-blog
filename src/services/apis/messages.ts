import http from '@/services/http'

const getMessages = (page:number) => {
  return http.get('/messages',{params:{
    page:page
  }})
}
const getMessagesNum = () => {
  return http.get('/messages/number')
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
  getMessagesNum
}