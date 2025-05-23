import { request, enhanceRequest } from '@/services/enhanceRequest'
// 请求留言
const getMessages = (page: number) => {
  return enhanceRequest({
    url: '/messages',
    method: 'GET',
    params: {
      page: page
    },
  })
}
// 请求留言数量
const getMessagesNum = () => {
  return enhanceRequest({
    url: '/messages/number',
    method: 'GET',
  })
}
// 请求弹幕
const getDammu = (page: number) => {
  return enhanceRequest({
    url: '/messages/dammu',
    method: 'GET',
    params: {
      page: page
    },
  })
}
// 发送留言
const postMessages = (params: any) => {
  return request.post('/messages/post', params)
}
export {
  getMessages,
  postMessages,
  getMessagesNum,
  getDammu,
}