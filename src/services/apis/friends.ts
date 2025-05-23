import { enhanceRequest, request } from '@/services/enhanceRequest'

// 请求朋友
const getFriends = () => {
  return enhanceRequest({
    url: '/friends',
    method: 'GET',
  })
}
// 上传朋友
const postFriend = (uid: number, name: string, label: string, url: string) => {
  return request.post('/friends/apply', {
    user_id: uid,
    name: name,
    label: label,
    url: url,
  })
}
// 请求公告
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