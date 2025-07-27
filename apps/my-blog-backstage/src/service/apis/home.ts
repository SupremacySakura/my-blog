import request from "../request"
import { iInfo, iTag } from "@/types/interfaceType"
const getTag = () => {
    return request.get('/home/tag')
}
const addTag = (tag: iTag) => {
    return request.post('/home/addTag', tag)
}
const deleteTag = (id: number) => {
    return request.delete('/home/deleteTag', { params: { id } })
}
const updateMyArticle = (file: FormData) => {
    return request.post('/home/updateMyArticle', file, { headers: { 'Content-Type': 'multipart/form-data' } })
}
const getMyArticle = () => {
    return request.get('/home/myArticle')
}
const getMyHeadPortrait = () => {
    return request.get('/home/myHeadPortrait')
}
const updateMyHeadPortrait = (file: FormData) => {
    return request.post('/home/updateMyHeadPortrait', file, { headers: { 'Content-Type': 'multipart/form-data' } })
}
const getMyInfo = () => {
    return request.get('/home/myInfo')
}
const updateMyInfo = (info: iInfo) => {
    return request.post('/home/updateMyInfo', info)
}
export {
    getTag,
    addTag,
    deleteTag,
    updateMyArticle,
    getMyArticle,
    getMyHeadPortrait,
    updateMyHeadPortrait,
    getMyInfo,
    updateMyInfo,
}