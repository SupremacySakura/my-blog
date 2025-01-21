//文章类型接口
interface iArticleItem {
  id: number,
  head: string,
  digest: string,
  article: string,
  userHeadPortrait: string,
  name: string,
  time: string,
  cover: string,
  label: string[],
  loading: boolean[],  // 第一项表示头像加载,第二项表示封面加载
}
//声明加载文章图片枚举
enum EArticlePhotoType {
  userHeadPortrait = 0,
  cover = 1
}

//友链类型接口
interface iFriendItem {
  id: number,
  userHeadPortrait: string,
  name: string,
  label: string,
  url: string,
  loading: boolean,
}

//标签类型接口
interface iLabelItem {
  id: number,
  text: string,
  color: string,
  backgroundColor: string,
}

//个人信息类型接口
interface iInformation {
  id: number,
  content: string,
  name: string,
  introduce: string,
  identity: string,
  address: string,
  userHeadPortrait: string,
  loading: boolean,
}

//评论类型接口
interface iMessageItem {
  id: number,
  userHeadPortrait: string,
  name: string,
  content: string,
  time: string,
  address: string,
  loading: boolean[],//第一项表示弹幕,第二项表示留言
}
enum EMessagePhotoType {
  Danmu = 0,
  Message = 1,
}

//朋友圈类型接口
interface iMomentItem {
  id: number,
  time: string,
  userHeadPortrait: string,
  name: string,
  content: string,
  loading: boolean,
}

//技术栈类型接口
interface iWaterFallItem {
  id: number,
  photo: string,
  text: string,
  src: string,
  height: number,
  icon: string,
  note: string,
  loading: boolean[],//第一项表示背景图片,第二项表示图标
}
enum EWaterFallPhotoType {
  photo = 0,
  icon = 1
}

//列数类型接口
interface iRowItem {
  id: number,
  height: number,
}
//文章标签类型接口
interface iTag {
  id: number,
  tag: string
}
//公告类型接口
interface iNotice {
  id: number,
  notice: string,
}
export type {
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
}
export {
  EArticlePhotoType,
  EWaterFallPhotoType,
  EMessagePhotoType,
}