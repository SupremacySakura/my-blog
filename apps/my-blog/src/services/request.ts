import axios from "axios"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from 'pinia'
import { refreshToken, isRefreshToken } from '@/services/apis/login'
const request = axios.create({
  baseURL: import.meta.env.VUE_APP_HTTP_URL,
  timeout: 10000,//请求超时时间
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在请求前做些什么,比如发送token
    const { _token,_refreshToken } = storeToRefs(useUserStore())
    config.headers.Authorization = `Bearer ${_token.value}`
    config.headers['refresh_token'] = _refreshToken.value
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  async (response) => {
    // 对响应数据做些什么
    // ✅ 获取 Authorization 头部
    const authHeader = response.headers['authorization']
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      const { _setInfo, _setToken } = useUserStore()
      _setInfo(response.data.data)
      _setToken(token)
    }
    const refreshHeader =response.headers['refresh_token']
    if (refreshHeader) {
      const token = refreshHeader
      const { _setRefreshToken } = useUserStore()
      _setRefreshToken(token)
    }
    return response
  },
  async (error) => {
    const { response } = error
    if (response && (response.status === 403 || response.status === 401) && !isRefreshToken(response.config)) {
      const isSuccess = await refreshToken()
      if (isSuccess.data.code === 200) {
        const { _token } = storeToRefs(useUserStore())
        response.config.headers.Authorization = `Bearer ${_token.value}`
        return request.request(response.config)
      }
    }
    return Promise.reject(error)
  }
)
export default request