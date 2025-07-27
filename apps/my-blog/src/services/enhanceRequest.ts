import request from "./request"
import type { AxiosRequestConfig } from "axios"

const enhanceRequest = (() => {
  const cacheMap = new Map<string, { data: any, timestamp: number }>()
  const CACHE_TTL = 60 * 1000
  return async function (config: AxiosRequestConfig) {
    let url = config.url || ''
    let params = config.params || ''
    const cacheKey = `${url}?${JSON.stringify(params)}`
    const cached = cacheMap.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return Promise.resolve(cached.data)
    } else {
      try {
        const res = await request(config)
        cacheMap.set(cacheKey, { data: res, timestamp: Date.now() })
        return Promise.resolve(res)
      } catch (error) {
        console.log('Request failed:', error)
        return Promise.reject(error)
      }
    }
  }
})()
export {
  request,
  enhanceRequest,
}