import { enhanceRequest } from '@/services/enhanceRequest'

// 请求开始时间
const getTime = () => {
  return enhanceRequest({
    url: '/asset/time',
    method: 'GET',
  })
}
// 请求访问人数
const getPeople = () => {
  return enhanceRequest({
    url: '/asset/people',
    method: 'GET',
  })
}
// 新增访问人数
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