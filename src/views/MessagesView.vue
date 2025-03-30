<script setup lang="ts">
//导入vue相关API
import { ref, onMounted, useTemplateRef, watchEffect, nextTick } from 'vue'
//导入默认图片
import background from '@/assets/messageBackground.jpg'
import user from '@/assets/user.png'
//导入工具函数
import { random } from '@/utils'
//导入留言相关API
import { getMessages, postMessages, getMessagesNum } from '@/services/apis/messages'
//导入ElementPlus组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'
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
//页码切换
enum PageChange {
  left = -1,
  right = 1
}
/**
 * 加载更多留言
 */
const handleGetMoreMessages = async (type: PageChange) => {
  if (type === PageChange.left && page.value === 1) {
    return
  }
  if (type === PageChange.right && page.value * 5 >= messageNum.value) {
    return
  }
  isLoading.value = true
  if (page.value % 4 === 0 && type === PageChange.right) {
    activePage.value++
  }
  if (page.value % 4 === 1 && type === PageChange.left) {
    activePage.value--
  }
  page.value += type
  try {
    await handleGetMessages()
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.log(error)
    if (type = 1) {
      page.value--
    } else if (type = -1) {
      page.value++
    }
  } finally {
    isLoading.value = false
  }
}
const handleGoToPage = async (index: number) => {
  isLoading.value = true
  const oldPage = page.value
  page.value = index
  try {
    await handleGetMessages()
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.log(error)
    page.value = oldPage
  } finally {
    isLoading.value = false
  }
}
const activeList = ref<number[]>([])
const activePage = ref(1)
const initActiveList = () => {
  activeList.value = []
  for (let i = 1; i <= Math.ceil(messageNum.value / 5); i++) {
    activeList.value.push(i)
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
          item.addEventListener('mouseenter', () => {
            if (item.getAnimations().length > 0) {
              item.getAnimations()[0].pause(); // 暂停动画
            }
          })
          item.addEventListener('mouseleave', () => {
            if (item.getAnimations().length > 0) {
              item.getAnimations()[0].play(); // 继续动画
            }
          })
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
  initActiveList()
})
</script>

<template>
  <div class="messagesBox">
    <!-- 上部留言板 -->
    <section class="board" ref="board">
      <img :src="background" alt="" class="backgroundImage">
      <div class="block"></div>
      <div class="boardDiv">
        <h1>
          <span>留言板</span>
          <span>欢迎留言,你可以在这里畅所欲言</span>
        </h1>

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
      <div class="messagesItem" v-for="item of messagesList.slice((page - 1) * 5, page * 5)" :key="item.id">
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
      <ul>
        <li @click="handleGetMoreMessages(PageChange.left)" :class="{ 'disabled': page === 1 }">
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </li>
        <li v-for="item of activeList.slice((activePage - 1) * 4, activePage * 4)" :key="item"
          :class="{ 'active': page === item }" @click="handleGoToPage(item)">{{ item }}</li>
        <li @click="handleGetMoreMessages(PageChange.right)" :class="{ 'disabled': page * 5 >= messageNum }">
          <el-icon>
            <ArrowRight />
          </el-icon>
        </li>
      </ul>
      <div class="loader" v-if="isLoading === true"></div>
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
  background: var(--message-background-color);
  color: var(--message-text-color);
  transition: background-color 0.3s ease;

  @media screen and (max-width: @screen-mini-mobile) {
    padding-left: 20px;
    padding-right: 20px;
  }

  //上部留言板
  .board {
    .size(@standardWidth, 900px * 0.8);
    .standardWidth;
    position: relative;
    color: white;
    margin-bottom: 30px;
    overflow: hidden;
    padding: 0px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .backgroundImage {
      .size(100%, 100%);
      position: absolute;
      border-radius: 15px;
      z-index: 0;
      object-fit: cover;
      transition: transform 3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .block {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      z-index: 1;
      backdrop-filter: blur(2px);
    }

    .boardDiv {
      .size(100%, 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 1;

      h1 {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        color: rgba(0, 0, 0, 0);
        background: url('../assets/messageBackground.jpg');
        background-size: 100% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        text-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);

        span:first-child {
          font-size: clamp(20px, 8vw, 100px);
          letter-spacing: 5px;
          font-weight: 700;
        }

        span:last-child {
          font-size: clamp(10px, 4vw, 60px);
          margin-top: 20px;
          letter-spacing: 2px;
          font-weight: 300;
        }
      }
    }

    .showItem {
      height: 50px;
      border-radius: 50px;
      display: flex;
      position: absolute;
      z-index: 1;
      background-color: rgba(62, 62, 63, 0.6);
      padding-right: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        transform: scale(1.05);
        background-color: rgba(80, 80, 80, 0.8);
      }

      .custom-image {
        .avatar(50px);
        border: 2px solid rgba(255, 255, 255, 0.5);
        margin-right: 8px;
      }

      .name {
        font-weight: 600;
        line-height: 50px;
        margin-right: 8px;
        color: rgba(255, 255, 255, 0.9);
      }

      .content {
        line-height: 50px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
      }
    }
  }

  //留言发布区
  .messagesPublish {
    .size(@standardWidth, 350px);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    background-color: var(--message-background-fill-color);
    padding: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    @media screen and (max-width: @screen-middle-mobile) {
      width: 90%;
    }

    @media screen and (max-width: @screen-mini-mobile) {
      width: 100%;
    }

    div:first-child {
      width: 100%;
      margin-bottom: 15px;

      h1 {
        font-size: 24px;
        font-weight: 600;
        color: var(--message-text-color);
        position: relative;
        display: inline-block;

        &:after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 50%;
          height: 3px;
          background: linear-gradient(90deg, var(--message-text-color), transparent);
          border-radius: 2px;
        }
      }
    }

    textarea {
      .size(98%, 200px);
      resize: none;
      outline: none;
      background-color: var(--message-background-color);
      color: var(--message-text-color);
      box-shadow: inset 3px 3px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      padding: 15px;
      font-size: 16px;
      transition: all 0.3s ease;

      &:focus {
        box-shadow: inset 3px 3px 10px rgba(0, 0, 0, 0.15);
        border-color: rgba(0, 0, 0, 0.2);
      }
    }

    div:last-child {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
    }

    button {
      .size(120px, 50px);
      border-radius: 50px;
      background-color: var(--message-background-fill-color);
      border: 1px solid var(--button-border-color);
      color: var(--message-text-color);
      cursor: pointer;
      box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1px;

      &:hover {
        background-color: var(--hover-button-background-color);
        color: var(--hover-button-text-color);
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
        transform: translateY(-3px);
      }

      &:active {
        transform: translateY(1px);
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      }
    }
  }

  //评论展示区
  .messagesShow {
    width: @standardWidth;
    min-height: 600px;
    margin-bottom: 30px;

    @media screen and (max-width: @screen-middle-mobile) {
      width: 90%;
    }

    @media screen and (max-width: @screen-mini-mobile) {
      width: 100%;
    }

    .showTop {
      margin-bottom: 20px;

      h4 {
        font-size: 18px;
        font-weight: 600;
        color: var(--message-text-color);
        display: inline-block;
        position: relative;
        padding-bottom: 5px;

        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--message-text-color), transparent);
          border-radius: 2px;
        }
      }
    }

    .messagesItem {
      width: 100%;
      min-height: 100px;
      display: flex;
      box-sizing: border-box;
      padding: 20px;
      margin-bottom: 20px;
      border: none;
      border-radius: 15px;
      background-color: var(--message-background-fill-color);
      color: var(--message-text-color);
      transition: all 0.3s ease;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

      &:hover {
        background: var(--message-card-gradient);
        transform: translateY(-5px);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
      }

      .leftSection {
        width: 70px;
        height: 100%;
        margin-right: 15px;

        .custom-image {
          .size(60px, 60px);
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.1);
          }
        }
      }

      .rightSection {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        h4 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
          color: var(--message-text-color);
        }

        p {
          width: 90%;
          word-break: break-word;
          white-space: normal;
          overflow: hidden;
          line-height: 1.6;
          font-size: 16px;
          margin-bottom: 15px;
          color: var(--message-text-color);
          opacity: 0.9;
        }

        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        address,
        time {
          font-size: 14px;
          color: var(--message-text-color);
          opacity: 0.6;
        }

        address {
          width: 120px;
          white-space: normal;
          word-wrap: break-word;
          overflow-wrap: break-word;
          font-style: normal;
          text-align: right;
        }

        time {
          font-style: italic;
        }
      }
    }
  }

  .moreSection {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;

    ul {
      display: flex;
      width: 300px;
      justify-content: space-around;
      margin-bottom: 20px;

      li {
        .size(40px, 40px);
        background-color: var(--message-background-fill-color);
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        border-radius: 8px;
        color: var(--message-text-color);
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        font-weight: 500;

        &:hover:not(.disabled) {
          transform: translateY(-5px);
          background-color: rgba(135, 206, 235, 0.5);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
      }

      .active {
        background-color: rgba(135, 206, 235, 1);
        color: white;
        font-weight: 600;
      }

      .disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }

  /* HTML: <div class="loader"></div> */
  .loader {
    .size(120px, 20px);
    margin-top: 20px;
    background: linear-gradient(90deg, #0001 33%, #0005 50%, #0001 66%) #f2f2f2;
    background-size: 300% 100%;
    animation: l1 1s infinite linear;
    border-radius: 10px;
  }

  @keyframes l1 {
    0% {
      background-position: right
    }
  }

  :deep(.el-dialog) {
    width: 500px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    @media screen and (max-width: @screen-mini-mobile) {
      width: 100vw;
    }
  }

  .dialogBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    color: var(--message-text-color);
    padding: 20px 0;

    @media screen and (max-width: @screen-mini-mobile) {
      width: 100vw;
    }

    h4 {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 20px;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 3px;
        background: linear-gradient(90deg, var(--message-text-color), transparent);
        border-radius: 2px;
      }
    }

    .topDiv {
      .size(100%, 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;

      .user {
        .avatar(85px);
        border: 5px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }

        label {
          display: block;
          .size(100%, 100%);
          border-radius: 85px;
          cursor: pointer;
        }

        div,
        img {
          .size(100%, 100%);
          border-radius: 85px;
          object-fit: cover;
        }

        div {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
          background-color: rgba(0, 0, 0, 0.05);
          color: var(--message-text-color);
        }
      }

      .name {
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 20px;

        span {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 5px;
          color: var(--message-text-color);
        }

        input {
          .size(200px, 40px);
          outline: none;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 0 15px;
          font-size: 16px;
          background-color: var(--message-background-color);
          color: var(--message-text-color);
          transition: all 0.3s ease;

          &:focus {
            border-color: rgba(0, 0, 0, 0.3);
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
          }
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
        margin-bottom: 10px;

        span {
          font-size: 16px;
          font-weight: 500;
          color: var(--message-text-color);
        }
      }

      input {
        .size(300px, 40px);
        outline: none;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 0 15px;
        font-size: 16px;
        background-color: var(--message-background-color);
        color: var(--message-text-color);
        transition: all 0.3s ease;

        &:focus {
          border-color: rgba(0, 0, 0, 0.3);
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }

  :deep(.dialog-footer) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;

    .el-button {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      &:first-child {
        background-color: var(--hover-button-background-color);
        color: var(--hover-button-text-color);
        border-color: var(--hover-button-background-color);
      }
    }
  }
}

:deep(.el-dialog) {
  --el-dialog-bg-color: var(--message-background-fill-color) !important;
}
</style>