import { enhanceRequest, request } from '@/services/enhanceRequest'

const getFriends = () => {
  return enhanceRequest({
    url: '/friends',
    method: 'GET',
  })
}
const postFriend = (uid: number, name: string, label: string, url: string) => {
  return request.post('/friends/apply', {
    user_id: uid,
    name: name,
    label: label,
    url: url,
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