import axios from "axios"

const request = axios.create({
  baseURL: import.meta.env.VUE_APP_HTTP_URL,
  timeout: 10000,//请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

//请求拦截器
request.interceptors.request.use(
  config => {
    //在请求前做些什么,比如发送token
    //config.headers.Authorization = 'Bearer ${token}
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//响应拦截器
request.interceptors.response.use(
  response => {
    //对响应数据做些什么
    return response
  },
  error => {
    //对响应错误做些什么
    return Promise.reject(error)
  }
)
export default request