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
  loading: boolean,
}
//友链类型接口
interface iFriendItem {
  id: number,
  userHeadPortrait: string,
  name: string,
  label: string,
  url: string,
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
}
//评论类型接口
interface iMessageItem {
  id: number,
  userHeadPortrait: string,
  name: string,
  content: string,
  time: string,
  address: string,
}
//朋友圈类型接口
interface iMomentItem {
  id: number,
  time: string,
  userHeadPortrait: string,
  name: string,
  content: string,

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
  loading:boolean,
}
//列数类型接口
interface iRowItem {
  id: number,
  height: number,
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
}