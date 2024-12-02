import { enhanceRequest } from '@/services/enhanceRequest'

const getMoments = () => {
  return enhanceRequest({
    url: '/moments',
    method: 'GET',
  })
}
const getTechnology = () => {
  return enhanceRequest({
    url: '/moments/technology',
    method: 'GET',
  })
}
export {
  getMoments,
  getTechnology,
}