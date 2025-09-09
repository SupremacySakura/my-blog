import { request, enhanceRequest } from '@/services/enhanceRequest'
// 请求留言
const getMessages = (page: number) => {
  return enhanceRequest({
    url: '/api/messages',
    method: 'GET',
    params: {
      page: page
    },
  })
}
// 请求留言数量
const getMessagesNum = () => {
  return enhanceRequest({
    url: '/api/messages/number',
    method: 'GET',
  })
}
// 请求弹幕
const getDanmu = (page: number) => {
  return enhanceRequest({
    url: '/api/messages/dammu',
    method: 'GET',
    params: {
      page: page
    },
  })
}
// 发送留言
const postMessages = (params: any) => {
  return request.post('/api/messages/post', params)
}
export {
  getMessages,
  postMessages,
  getMessagesNum,
  getDanmu,
}