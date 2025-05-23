import { enhanceRequest, request } from '@/services/enhanceRequest'
const postLogin = (username: string, password: string) => {
    return request.post('/login', {
        username: username,
        password: password
    })
}
const postSendVerificationCode = (email: string) => {
    return request.post('/login/sendVerificationCode', {
        email: email
    })
}
const postRegister = (username: string, password: string, email: string,code:string) => {
    return request.post('/login/register', {
        username,
        password,
        email,
        code,
    })
}
const getJWT = () => {
    return request.get('/login/jwt')
}
export {
    postLogin,
    getJWT,
    postSendVerificationCode,
    postRegister,
}