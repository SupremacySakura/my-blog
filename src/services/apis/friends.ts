import { enhanceRequest } from '@/services/enhanceRequest'

const getFriends = () => {
  return enhanceRequest({
    url: '/friends',
    method: 'GET',
  })
}

export {
  getFriends,
}