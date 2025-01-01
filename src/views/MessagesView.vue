<script setup lang="ts">
//导入vue相关API
import { ref, onMounted, useTemplateRef, watchEffect, nextTick } from 'vue'
//导入默认图片
import background from '@/assets/messageBackground.jpeg'
import user from '@/assets/user.png'
//导入工具函数
import { random } from '@/utils'
//导入留言相关API
import { getMessages, postMessages, getMessagesNum } from '@/services/apis/messages'
//导入ElementPlus组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
//导入dayjs库
import dayjs from 'dayjs'
//导入留言仓库
import { useMessagesStore } from '@/stores/messages'
const { _userHeadPortrait, _name, _address, _setInfo } = useMessagesStore()
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options } = useAssetStore()
//导入类型
import type { iMessageItem } from '@/types'
import { EMessagePhotoType } from '@/types'
//定义评论数组
const messagesList = ref<iMessageItem[]>([])
//page
const page = ref(1)
//留言数量
const messageNum = ref(0)
//加载状态
const isLoading = ref(false)
/**
 * 获取留言数据,并赋值给messagesList
 */
const handleGetMessages = async () => {
  await handleGetMessagesNum()
  const res = await getMessages(page.value)
  if (+res.data.code === 200) {
    messagesList.value = [...messagesList.value, ...res.data.data,].reduce((acc, current) => {
      if (!acc.some((item: any) => item.id === current.id)) {
        acc.push(current)
      }
      return acc
    }, [])
    messagesList.value.forEach((item) => {
      if (!item.loading) {
        item.loading = [true, true]
      }
    })
    //手动触发弹幕动画更新
    count.value++
  }
}
/**
 * 获取留言数量
 */
const handleGetMessagesNum = async () => {
  const res = await getMessagesNum()
  if (+res.data.code === 200) {
    messageNum.value = res.data.data || 0
  }
}
/**
 * 加载更多留言
 */
const handleGetMoreMessages = async () => {
  isLoading.value = true
  page.value++
  try {
    await handleGetMessages()
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.log(error)
    if (page.value > 1) {
      page.value--
    }
  } finally {
    isLoading.value = false
  }


}
//发布留言弹窗控制
const dialogVisible = ref(false)
//发布评论信息
const userHeadPortrait = ref(_userHeadPortrait)
const content = ref('')
const name = ref(_name)
const address = ref(_address)
/**
 * 打开基本信息填写面板
 */
const handleOpen = () => {
  if (content.value) {
    dialogVisible.value = true
  } else {
    ElMessage.error('评论不能为空')
  }
}
/**
 * 选择头像
 * @param event 
 */
const handleChooseUserHeadPortrait = (event: any) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userHeadPortrait.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    ElMessage.error('请选择一张图片')
  }
}
/**
 * 发布留言
 */
const handlePublish = async () => {
  const time = dayjs().format('YYYY-MM-DD HH:mm:ss') // 自定义时间格式
  let params
  if (userHeadPortrait.value === user) {
    params = {
      userHeadPortrait: '',
      name: name.value,
      content: content.value,
      time: time,
      address: address.value
    }
  } else {
    params = {
      userHeadPortrait: userHeadPortrait.value,
      name: name.value,
      content: content.value,
      time: time,
      address: address.value
    }
  }
  if (!name.value) {
    ElMessage.error('请填写你的昵称')
    return
  }
  const loadingInstance = ElLoading.service(_options)
  dialogVisible.value = false
  content.value = ''
  const resP = await postMessages(params)
  if (resP.data.code === 200) {
    loadingInstance.close()
    ElMessage({
      message: '发布成功',
      type: 'success',
    })
  } else {
    loadingInstance.close()
    ElMessage.error('发布失败')
  }
  const res = await getMessages(1)
  if (+res.data.code === 200) {
    messagesList.value.unshift(res.data.data[0])
    messagesList.value[0].loading = [true, true]
    //手动触发弹幕动画更新
    count.value++
  }
  _setInfo(userHeadPortrait.value, name.value, address.value)
}
//留言板dom
const board = useTemplateRef('board')
//留言板弹幕dom
const showList = useTemplateRef("showList")
// 监听留言,添加动画
//手动监听控制器
const count = ref(0)
watchEffect(() => {
  count.value
  if (showList.value && board.value) {
    nextTick(() => {
      if (showList.value && board.value instanceof HTMLElement && board.value) {
        const boardWidth = board.value.offsetWidth || 0;
        (showList.value as HTMLDivElement[]).map((item, index) => {
          const itemWidth = item.offsetWidth || 0;
          if (item.getAnimations().length === 0 && item && !isNaN(boardWidth) && !isNaN(itemWidth)) {
            item.style.top = `${random(0, 670)}px`
            item.style.right = `${-itemWidth}px`
            const animateMessage = () => {
              item.animate([
                { transform: 'translateX(0)' }, // 起始状态
                { transform: `translateX(-${boardWidth + itemWidth}px)` } // 结束状态
              ], {
                duration: random(6000, 12000),
                iterations: 1 // 无限循环
              }).onfinish = () => {
                item.style.top = `${random(0, 670)}px`
                animateMessage()
              }
            }
            animateMessage()
          }
        })
      }

    })
  } else {

  }
})
//处理错误图片
const onError = (item: iMessageItem) => {
  item.userHeadPortrait = user
}
/**
 * 图片加载完成
 * @param item 文章类
 * @param type 图片类型
 */
const onImageLoad = (item: iMessageItem, type: EMessagePhotoType) => {
  switch (type) {
    case EMessagePhotoType.Danmu:
      item.loading[EMessagePhotoType.Danmu] = false
      break
    case EMessagePhotoType.Message:
      item.loading[EMessagePhotoType.Message] = false
      break
    default:
      break
  }
}
onMounted(async () => {
  const loadingInstance = ElLoading.service(_options)
  //初始化
  try {
    await handleGetMessages()
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.log(error)
  } finally {
    nextTick(() => {
      setTimeout(() => {
        loadingInstance.close()
      }, 0)
    })
  }
})
</script>

<template>
  <div class="messagesBox">
    <!-- 上部留言板 -->
    <section class="board" ref="board">
      <img :src="background" alt="" class="backgroundImage">
      <div class="boardDiv">
        <h1>留言板</h1>
        <h4>欢迎留言,你可以在这里畅所欲言</h4>
      </div>
      <div class="showItem" v-for="item of messagesList" ref="showList" :key="item.id">
        <el-image :src="item.userHeadPortrait || user" alt="头像" class="custom-image" fit="cover" lazy
          @error="onError(item)" v-loading="item.loading[EMessagePhotoType.Danmu]"
          @load="onImageLoad(item, EMessagePhotoType.Danmu)"></el-image>
        <span class="name">{{ item.name }}:</span>
        <span class="content">{{ item.content }}</span>
      </div>
    </section>
    <!-- 评论区 -->
    <section class="messagesPublish">
      <div>
        <h1>留下你的评论</h1>
      </div>
      <textarea name="messages" placeholder="请输入你的留言" v-model.trim="content"></textarea>
      <div>
        <button @click="handleOpen()">发表</button>
      </div>
    </section>
    <!-- 评论区展示 -->
    <section class="messagesShow">
      <div class="showTop">
        <h4>评论数量:{{ messageNum }}</h4>
      </div>
      <div class="messagesItem" v-for="item of messagesList" :key="item.id">
        <section class="leftSection">
          <el-image :src="item.userHeadPortrait || user" alt="头像" class="custom-image" fit="cover" lazy
            @error="onError(item)" v-loading="item.loading[EMessagePhotoType.Message]"
            @load="onImageLoad(item, EMessagePhotoType.Message)"
            :preview-src-list="[item.userHeadPortrait || user]"></el-image>
        </section>
        <section class="rightSection">
          <h4>{{ item.name }}</h4>
          <p>{{ item.content }}</p>
          <div>
            <time>{{ item.time }}</time>
            <address>{{ item.address }}</address>
          </div>
        </section>
      </div>
    </section>
    <section class="moreSection">
      <el-button @click="handleGetMoreMessages()"
        v-if="messageNum > messagesList.length && isLoading === false">点击加载更多</el-button>
      <span v-else-if="isLoading === false">已经没有更多了</span>
      <div class="loader" v-else></div>
    </section>
    <!-- 发表评论弹窗 -->
    <el-dialog v-model="dialogVisible">
      <section class="dialogBox">
        <h4>基本信息填写</h4>
        <div class="topDiv">
          <div class="user">
            <label for="choose">
              <img :src="userHeadPortrait" alt="" v-if="!!userHeadPortrait">
              <div class="addUser" v-else>
                <input type="file" accept="image/*" @change="(e) => handleChooseUserHeadPortrait(e)" id="choose"
                  :style="{ display: 'none' }">
                +
              </div>
            </label>
          </div>
          <div class="name">
            <span>昵称(必填)</span>
            <input type="text" v-model.trim="name">
          </div>
        </div>
        <div class="bottomDiv">
          <div>
            <span>联系地址(选填)</span>
          </div>
          <input type="text" v-model="address">
        </div>
      </section>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handlePublish()">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="userHeadPortrait = user">使用默认头像</el-button>
          <el-button @click="userHeadPortrait = ''">删除头像</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
@standardWidth: 1600px * 0.8px;
@screen-middle-mobile: 1600px * 0.8px;
@screen-mini-mobile: 500px;

.messagesBox {
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  padding: 100px 40px 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--message-background-color);
  color: var(--message-text-color);

  @media screen and (max-width:@screen-mini-mobile) {
    padding-left: 20px;
    padding-right: 20px;
  }

  //上部留言板
  .board {
    .size(@standardWidth, 900px * 0.8);
    position: relative;
    color: white;
    margin-bottom: 10px;
    overflow: hidden;

    @media screen and (max-width:@screen-middle-mobile) {
      width: 90%;
    }

    @media screen and (max-width:@screen-mini-mobile) {
      width: 100%;
    }

    .backgroundImage {
      .size(100%, 100%);
      position: absolute;
      border-radius: 10px;
      z-index: 0;
    }

    .boardDiv {
      .size(100%, 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 1;
    }

    .showItem {
      height: 50px;
      border-radius: 50px;
      display: flex;
      position: absolute;
      z-index: 1;
      background-color: rgba(62, 62, 63, 0.5);

      .custom-image {
        .avatar(50px);
      }

      .name {
        font-weight: 500px;
        line-height: 50px;
      }

      .content {

        line-height: 50px;
      }
    }
  }

  //留言发布区
  .messagesPublish {
    .size(@standardWidth, 350px);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    @media screen and (max-width:@screen-middle-mobile) {
      width: 90%;
    }

    @media screen and (max-width:@screen-mini-mobile) {
      width: 100%;
    }

    textarea {
      .size(98%, 200px);
      resize: none;
      /* 禁止缩放 */
      outline: none;
      background-color: var(--message-background-fill-color);
      color: var(--message-text-color);
    }

    div {
      width: 100%;
    }

    button {
      .size(100px, 50px);
      border-radius: 50px;
      background-color: var(--message-background-fill-color);
      border: 1px solid var(--button-border-color);
      color: var(--message-text-color);
      cursor: pointer;

      &:hover {
        background-color: var(--hover-button-background-color);
        color: var(--hover-button-text-color);
      }
    }
  }

  //评论展示区
  .messagesShow {
    width: @standardWidth;

    @media screen and (max-width:@screen-middle-mobile) {
      width: 90%;
    }

    @media screen and (max-width:@screen-mini-mobile) {
      width: 100%;
    }

    .showTop {
      margin-bottom: 10px;
    }

    .messagesItem {
      width: 100%;
      min-height: 100px;
      display: flex;
      box-sizing: border-box;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      border-radius: 10px;
      background-color: var(--message-background-fill-color);
      color: var(--message-text-color);

      .leftSection {
        .size(50px, 100%);

        .custom-image {
          .size(50px, 50px);
          border-radius: 50%;
        }
      }

      .rightSection {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        p {
          width: 90%;
          word-break: break-word;
          white-space: normal;
          overflow: hidden;
          /* 长单词或字符串在必要时换行 */
        }

        div {
          display: flex;
          justify-content: space-between;
        }

        address,
        time {
          font-size: 12px;
          color: rgb(166.2, 168.6, 173.4);
        }

        address {
          width: 120px;
          white-space: normal;
          /* 允许文本自动换行 */
          word-wrap: break-word;
          /* 允许长单词自动换行 */
          overflow-wrap: break-word;
          /* 允许长文本自动换行 */
        }
      }
    }
  }

  .moreSection {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* HTML: <div class="loader"></div> */
  .loader {
    .size(120px, 20px);
    background:
      linear-gradient(90deg, #0001 33%, #0005 50%, #0001 66%) #f2f2f2;
    background-size: 300% 100%;
    animation: l1 1s infinite linear;
  }

  @keyframes l1 {
    0% {
      background-position: right
    }
  }

  :deep(.el-dialog) {
    width: 500px;

    @media screen and (max-width:@screen-mini-mobile) {
      width: 100vw;
    }
  }

  .dialogBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    color: var(--message-text-color);

    @media screen and (max-width:@screen-mini-mobile) {
      width: 100vw;
    }

    .topDiv {
      .size(100%, 100px);
      display: flex;
      align-items: center;
      justify-content: center;

      .user {
        .avatar(85px);
        border: 5px solid black;

        label {
          display: block;
          .size(100%, 100%);
          border-radius: 85px;
        }

        div,
        img {
          .size(100%, 100%);
          border-radius: 85px;
        }

        div {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .name {
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 10px;

        input {
          .size(200px, 30px);
          outline: none;

        }
      }
    }

    .bottomDiv {
      .size(100%, 100px);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      div {
        width: 300px;
      }

      input {
        .size(300px, 30px);
        outline: none;
      }
    }
  }
}

:deep(.el-dialog) {
  --el-dialog-bg-color: var(--message-background-fill-color) !important;
}
</style>