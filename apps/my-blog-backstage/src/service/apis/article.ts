import { iArticleUpload } from "@/types/interfaceType"
import request from "../request"

const getArticle = () => {
    return request.get('/article')
}
const addArticle = (article: iArticleUpload) => {
    return request.post('/article/addArticle', article)
}
const deleteArticle = (id: number) => {
    return request.delete('/article/deleteArticle', { params: { id } })
}
export {
    getArticle,
    addArticle,
    deleteArticle,
}