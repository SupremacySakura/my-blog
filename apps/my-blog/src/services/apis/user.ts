import { request } from '@/services/enhanceRequest'

// 更换头像
const postAvatar = (formdata: unknown) => {
    return request.post('/api/user/changeAvatar', formdata, {
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    })
}
// 更新用户名
const postUsername = (uid: number, username: string) => {
    return request.post('/api/user/changeUsername', {
        uid,
        username
    })
}
// 更新邮箱
const postEmail = (uid: number, email: string) => {
    return request.post('/api/user/changeEmail', {
        uid,
        email
    })
}
// 更新地址
const postAddress = (uid: number, address: string) => {
    return request.post('/api/user/changeAddress', {
        uid,
        address
    })
}
export {
    postAvatar,
    postUsername,
    postEmail,
    postAddress,
}