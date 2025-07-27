import request from "../request"

const getAsset = () => {
    return request.get('/asset')
}

export {
    getAsset,
}