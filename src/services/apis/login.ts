import { enhanceRequest, request } from '@/services/enhanceRequest'
const postLogin = (username: string, password: string) => {
    return request.post('/login', {
        username: username,
        password: password
    })
}
const getJWT = () => {
    return request.get('/login/jwt')
}
export {
    postLogin,
    getJWT,
}