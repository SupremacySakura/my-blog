import { request } from '@/services/enhanceRequest'

// 更换头像
const postAvatar = (formdata: unknown) => {
    return request.post('/user/changeAvatar', formdata,{
        headers: {
            'Content-Type': 'multipart/form-data;'
          }
    })
}

export {
    postAvatar,
}