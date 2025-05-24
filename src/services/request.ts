import axios from "axios"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from 'pinia'
import { refreshToken } from '@/services/apis/login'
const request = axios.create({
  baseURL: import.meta.env.VUE_APP_HTTP_URL,
  timeout: 10000,//请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在请求前做些什么,比如发送token
    const { _token } = storeToRefs(useUserStore())
    config.headers.Authorization = `Bearer ${_token.value}`
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    if (response.data.token || response.data.isLogin) {
      console.log(response.data)
      const { _setInfo, _setToken } = useUserStore()
      _setInfo(response.data.data)
      _setToken(response.data.token)
    }
    if (+response.status === 403 || +response.status === 401) {
      refreshToken()
    }
    return response
  },
  error => {
    // 对响应错误做些什么
    return Promise.reject(error)
  }
)
export default request