<script setup lang="ts">
//导入Vue相关API
import { ref, onMounted, useTemplateRef, watchEffect, nextTick, watch } from 'vue'
//导入测试图片
import background from '@/assets/messageBackground.jpeg'
import user from '@/assets/user.png'
//导入工具函数
import { random } from '@/utils'
//导入留言相关API
import { getMessages, postMessages } from '@/services/apis/messages'
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
//定义评论类型接口
interface iMessageItem {
  id: number,
  userHeadPortrait: string,
  name: string,
  content: string,
  time: string,
  address: string,
}
//定义评论数组
const messagesList = ref<iMessageItem[]>([])
/**
 * 获取留言数据,并赋值给messagesList
 */
const handleGetMessages = async () => {
  const res = await getMessages()
  if (+res.data.code === 200) {
    messagesList.value = res.data.data
    messagesList.value.forEach((item) => {
      if (!item.userHeadPortrait) {
        item.userHeadPortrait = user
      }
    })
    count.value++
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
      if (e.target != null) {
        userHeadPortrait.value = e.target.result as string
      }
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
  const params = {
    userHeadPortrait: userHeadPortrait.value,
    name: name.value,
    content: content.value,
    time: time,
    address: address.value
  }
  if (!name.value) {
    ElMessage.error('请填写你的昵称')
    return
  }
  const loadingInstance = ElLoading.service(_options)
  dialogVisible.value = false
  content.value = ''
  const res = await postMessages(params)
  if (res.data.code === 200) {
    loadingInstance.close()
    ElMessage({
      message: '发布成功',
      type: 'success',
    })
  } else {
    loadingInstance.close()
    ElMessage.error('发布失败')
  }
  handleGetMessages()
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
  if (showList.value) {
    nextTick(() => {
      if (showList.value) {
        showList.value.map((item, index) => {
          if (item.getAnimations().length === 0) {
            item.style.top = `${random(0, 670)}px`
            const animateMessage = () => {
              item.animate([
                { transform: 'translateX(0)' }, // 起始状态
                { transform: 'translateX(-1480px)' } // 结束状态
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
onMounted(async () => {
  const options = {
    lock: true, // 锁定屏幕，禁止操作
    text: '正在加载...(若长时间无法加载出来,请刷新页面)',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 1)',
  }
  const loadingInstance = ElLoading.service(options)
  //初始化
  await handleGetMessages()
  nextTick(() => {
    setTimeout(() => {
      loadingInstance.close()
    }, 0)
  })
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
        <el-image :src="item.userHeadPortrait" alt="头像" class="custom-image" fit="cover" lazy
          @error="onError(item)"></el-image>
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
        <h4>评论数量:{{ messagesList.length }}</h4>
      </div>
      <div class="messagesItem" v-for="item of messagesList" :key="item.id">
        <section class="leftSection">
          <el-image :src="item.userHeadPortrait" alt="头像" class="custom-image" fit="cover" lazy
            @error="onError(item)"></el-image>
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
    <!-- 发表评论弹窗 -->
    <el-dialog v-model="dialogVisible" width="500">
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
            <input type="text" v-model="name">
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

.messagesBox {
  width: 100%;
  box-sizing: border-box;
  min-width: 750px;
  min-height: 100vh;
  padding-top: 100px;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(247, 247, 247, 1);

  .board {
    width: @standardWidth;
    height: 900px * 0.8;
    position: relative;
    color: white;
    margin-bottom: 10px;
    overflow: hidden;

    .backgroundImage {
      width: 100%;
      height: 100%;
      position: absolute;
      border-radius: 10px;
      z-index: 0;
    }

    .boardDiv {
      width: 100%;
      height: 100%;
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
      right: -200px;

      .custom-image {
        width: 50px;
        height: 50px;
        border-radius: 50px;
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

  .messagesPublish {
    width: @standardWidth;
    height: 350px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    textarea {
      width: 98%;
      height: 200px;
      resize: none; /* 禁止缩放 */
      outline: none;
    }

    div {
      width: 100%;
    }

    button {
      width: 100px;
      height: 50px;
      border-radius: 50px;
      background-color: #f7f7f7;
      border: none;
    }
  }

  .messagesShow {
    width: @standardWidth;

    .showTop {
      margin-bottom: 10px;
    }

    .messagesItem {
      width: 100%;
      height: 100px;
      display: flex;
      box-sizing: border-box;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      border-radius: 10px;
      background-color: rgba(255,255,255,1);

      .leftSection {
        width: 50px;
        height: 100%;

        .custom-image {
          width: 50px;
          height: 50px;
          border-radius: 25px;
        }
      }

      .rightSection {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        div {
          display: flex;
          justify-content: space-between;
        }

        address,
        time {
          font-size: 12px;
          color: rgb(166.2, 168.6, 173.4);
        }
      }
    }
  }

  .dialogBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;

    .topDiv {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;

      .user {
        width: 85px;
        height: 85px;
        border-radius: 85px;
        border: 5px solid black;

        label {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 85px;
        }

        div,
        img {
          width: 100%;
          height: 100%;
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
          width: 200px;
          height: 30px;
          outline: none;

        }
      }
    }

    .bottomDiv {
      width: 100%;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      div {
        width: 300px;
      }

      input {
        width: 300px;
        height: 30px;
        outline: none;
      }
    }
  }
}
</style>