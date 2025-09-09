import { enhanceRequest } from '@/services/enhanceRequest'

// 请求朋友圈
const getMoments = () => {
  return enhanceRequest({
    url: '/api/moments',
    method: 'GET',
  })
}
// 请求资源
const getTechnology = () => {
  return enhanceRequest({
    url: '/api/moments/technology',
    method: 'GET',
  })
}
export {
  getMoments,
  getTechnology,
}