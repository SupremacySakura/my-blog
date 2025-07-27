import { iMoment, iTechnology } from "@/types/interfaceType"
import request from "../request"

const getMoments = () => {
    return request.get('/share')
}
const addMoment = (moment: iMoment) => {
    return request.post('/share/addMoment', moment)
}
const deleteMoment = (id: number) => {
    return request.delete('/share/deleteMoment', { params: { id } })
}
const getTechnology = () => {
    return request.get('/share/technology')
}
const addTechnology = (technology: iTechnology) => {
    return request.post('/share/addTechnology', technology)
}
const deleteTechnology = (id: number) => {
    return request.delete('/share/deleteTechnology', { params: { id } })
}
export {
    getMoments,
    addMoment,
    deleteMoment,
    getTechnology,
    addTechnology,
    deleteTechnology,
}