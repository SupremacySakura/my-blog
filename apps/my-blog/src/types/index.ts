// 用户类型接口 
interface iUser {
  _id: number
  username: string
  password: string
  avatar: string
  email: string
  address: string
}
// 路由接口
interface iTabBarItem {
  id: number
  text: string
  path: string
  isNeedLogin?: boolean
}
// 文章类型接口
interface iArticleItem {
  _id: number
  head: string
  digest: string
  article: string
  time: string
  cover: string
  label: string[]
  loading: boolean[] // 第一项表示头像加载,第二项表示封面加载
  user: iUser
}
// 声明加载文章图片枚举
enum EArticlePhotoType {
  userHeadPortrait = 0,
  cover = 1
}

// 友链类型接口
interface iFriendItem {
  id: number
  name: string
  label: string
  url: string
  loading: boolean
  user: iUser
}

// 标签类型接口
interface iLabelItem {
  _id: number
  text: string
  color: string
  backgroundColor: string
}

// 个人信息类型接口
interface iInformation extends iUser {
  _id: number
  content: string
  introduce: string
  identity: string
  loading: boolean
}

// 评论类型接口
interface iMessageItem {
  id: number
  content: string
  time: string
  address: string
  loading: boolean[] // 第一项表示弹幕,第二项表示留言
  user: iUser
}
// 朋友圈类型接口
interface iMomentItem {
  id: number
  time: string
  content: string
  loading: boolean
  user: iUser
}

// 技术栈类型接口
interface iWaterFallItem {
  id: number
  photo: string
  text: string
  src: string
  height: number
  icon: string
  note: string
  loading: boolean[] // 第一项表示背景图片,第二项表示图标
}
enum EWaterFallPhotoType {
  photo = 0,
  icon = 1
}

// 列数类型接口
interface iRowItem {
  id: number
  height: number
}
// 文章标签类型接口
interface iTag {
  _id: number
  tag: string
}
// 标题类型接口
interface iTocItem {
  anchor: string
  level: number
  text: string | null
  el: HTMLElement
}
// 公告类型接口
interface iNotice {
  _id: string
  notice: string
}

export type {
  iTabBarItem,
  iArticleItem,
  iFriendItem,
  iLabelItem,
  iInformation,
  iMessageItem,
  iMomentItem,
  iWaterFallItem,
  iRowItem,
  iTag,
  iNotice,
  iTocItem,
  iUser,
}
export {
  EArticlePhotoType,
  EWaterFallPhotoType,
}