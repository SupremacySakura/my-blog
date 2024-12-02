import { request, enhanceRequest } from '@/services/enhanceRequest'

const getMessages = (page: number) => {
  return enhanceRequest({
    url: '/messages',
    method: 'GET',
    params: {
      page: page
    },
  })
}
const getMessagesNum = () => {
  return enhanceRequest({
    url: '/messages/number',
    method: 'GET',
  })
}
const postMessages = (params: any) => {
  return request.post('/messages/post', {
    userHeadPortrait: params.userHeadPortrait,
    name: params.name,
    content: params.content,
    time: params.time,
    address: params.address,
  })
}
export {
  getMessages,
  postMessages,
  getMessagesNum
}