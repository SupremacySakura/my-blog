import { enhanceRequest } from '@/services/enhanceRequest'

// 请求个人信息
const getMyInformation = () => {
  return enhanceRequest({
    url: '/my',
    method: 'GET',
  })
}
// 请求个人标签
const getMyLabels = () => {
  return enhanceRequest({
    url: '/my/labels',
    method: 'GET',
  })
}
export {
  getMyInformation,
  getMyLabels,
}