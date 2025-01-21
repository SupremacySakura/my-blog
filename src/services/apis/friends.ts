import { enhanceRequest, request } from '@/services/enhanceRequest'

const getFriends = () => {
  return enhanceRequest({
    url: '/friends',
    method: 'GET',
  })
}
const postFriend = (userHeadPortrait: string, name: string, label: string, url: string, type: boolean) => {
  return request.post('/friends/apply', {
    userHeadPortrait: userHeadPortrait,
    name: name,
    label: label,
    url: url,
    type: type
  })
}
const getNotice = () => {
  return enhanceRequest({
    url: '/friends/notice',
    method: 'GET',
  })
}
export {
  getFriends,
  postFriend,
  getNotice
}