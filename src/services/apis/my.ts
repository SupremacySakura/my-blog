import { enhanceRequest } from '@/services/enhanceRequest'
const getMyInformation = () => {
  return enhanceRequest({
    url: '/my',
    method: 'GET',
  })
}
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