interface user {
    uid: number,
    username: string,
    password: string,
    email: string,
    avatar: string,
    address: string,
}
//导航类型接口
interface iNav {
    id: number,
    name: string,
    icon: string,
    path: string,
}
//标签类型接口
interface iTag {
    id?: number,
    text: string,
    color: string,
    backgroundColor: string,
}
//时间类型接口
interface iTime {
    day: number,
    hour: number,
    minute: number,
    second: number,
}
//信息类型接口
interface iInfo extends user {
    introduce: string,
    identity: string,
    user_id: number,
}
//分享类型接口
interface iMomentUpload {
    id?: number,
    user_id: number,
    time: string,
    content: string,
}
interface iMomentDownload extends user {
    id: number,
    user_id: number,
    time: string,
    content: string,
}
//技术栈类型接口
interface iTechnology {
    id?: number,
    photo: string,
    text: string,
    src: string,
    height: number,
    icon: string,
    note: string
}
//文章类型接口
interface iArticleUpload {
    arid?: number,
    head: string,
    digest: string,
    article: string,
    time: string,
    cover: string,
    label: string[],
    user_id: number,
}
interface iArticleDownload extends user {
    arid: number,
    head: string,
    digest: string,
    article: string,
    time: string,
    cover: string,
    label: string[],
    user_id: number,
}
//留言类型接口
interface iMessage extends user {
    id?: number,
    content: string,
    time: string,
}
//朋友类型接口
interface iFriendUpload {
    id?: number,
    label: string,
    url: string,
    status: boolean,
    user_id: number,
}
interface iFriendDownload extends user {
    id?: number,
    label: string,
    url: string,
    status: boolean,
    user_id: number,
}
export type {
    iNav,
    iTag,
    iTime,
    iInfo,
    iMomentUpload,
    iMomentDownload,
    iTechnology,
    iArticleUpload,
    iArticleDownload,
    iMessage,
    iFriendUpload,
    iFriendDownload,
}