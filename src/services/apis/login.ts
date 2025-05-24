import { request } from '@/services/enhanceRequest'

// 请求登录
const postLogin = (username: string, password: string) => {
    return request.post('/login', {
        username: username,
        password: password
    })
}
// 发送验证码
const postSendVerificationCode = (email: string) => {
    return request.post('/login/sendVerificationCode', {
        email: email
    })
}
// 注册账号
const postRegister = (username: string, password: string, email: string,code:string) => {
    return request.post('/login/register', {
        username,
        password,
        email,
        code,
    })
}
// 测试用
const getJWT = () => {
    return request.get('/login/jwt')
}
// 刷新token
const refreshToken = () => {
    return request.get('/login/refresh')
}
export {
    postLogin,
    getJWT,
    postSendVerificationCode,
    postRegister,
    refreshToken,
}