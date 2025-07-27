import { iFriend } from "@/types/interfaceType"
import request from "../request"

const getFriendList = () => {
    return request.get('/friend')
}
const addFriend = (friend: iFriend) => {
    return request.post('/friend/addFriend', friend)
}
const deleteFriend = (id: number) => {
    return request.delete('/friend/deleteFriend', { params: { id } })
}
const changeFriendStatus = (id: number, status: boolean) => {
    return request.post('/friend/changeFriendStatus', { id, status })
}
export {
    getFriendList,
    addFriend,
    deleteFriend,
    changeFriendStatus,
}