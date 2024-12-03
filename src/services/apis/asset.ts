import { request, enhanceRequest } from '@/services/enhanceRequest'
const getTime = () => {
  return enhanceRequest({
    url: '/asset/time',
    method: 'GET',
  })
}

const getPeople = () => {
  return enhanceRequest({
    url: '/asset/people',
    method: 'GET',
  })
}
const visit = () => {
  return enhanceRequest({
    url: '/asset/get',
    method: 'POST',
  })
}
export {
  getTime,
  getPeople,
  visit,
}