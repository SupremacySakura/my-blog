import request from "../request"

const getMessageList = () => {
    return request.get('/message')
}
const deleteMessage = (id: number) => {
    return request.delete('/message/deleteMessage', { params: { id } })
}
export {
    getMessageList,
    deleteMessage,
}