<script setup lang="ts">
import { ref, onMounted, useTemplateRef, watchEffect, nextTick } from 'vue'
import background from '@/assets/messageBackground.jpeg'
import user from '@/assets/user.png'
import { random } from '@/utils'
import { getMessages,postMessages } from '@/services/apis/messages'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
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
const messagesList = ref<iMessageItem[]>([
  // {
  //   id: 0,
  //   userHeadPortrait: user,
  //   name: '余心知秋',
  //   content: '测试1',
  //   time: '2024/10/30 20:58:30',
  //   address: '2712794459(qq)',
  // },
  // {
  //   id: 1,
  //   userHeadPortrait: user,
  //   name: '余心知秋',
  //   content: '测试2',
  //   time: '2024/10/30 21:08:30',
  //   address: '2712794459(qq)',
  // },
])
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
  }
}
const dialogVisible = ref(false)
//发布评论信息
const userHeadPortrait = ref('')
const content = ref('')
const name = ref('')
const address = ref('')
/**
 * 打开基本信息填写面板
 */
const handleOpen = () =>{
  if(content.value){
    dialogVisible.value = true
  }else{
    ElMessage.error('评论不能为空')
  }
}
const handleChooseUserHeadPortrait = (event:any) => {
  const file = event.target.files[0]
  if(file && file.type.startsWith('image/')){
    const reader = new FileReader()
    reader.onload = (e) => {
      if(e.target!=null){
        userHeadPortrait.value = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }else{
    ElMessage.error('请选择一张图片')
  }
}
const handlePublish =async () => {
  const time = dayjs().format('YYYY-MM-DD HH:mm:ss') // 自定义时间格式
  const params = {
    userHeadPortrait:userHeadPortrait.value,
    name:name.value,
    content:content.value,
    time:time,
    address:address.value
  }
 const res =await postMessages(params)
 if(res.data.code === 200){
   ElMessage({
     message: '发布成功',
     type: 'success',
   })
 }else{
   ElMessage.error('发布失败')
 }
 dialogVisible.value = false
}
const board = useTemplateRef('board')
watchEffect(() => {
  if (board.value) {
    messagesList.value.map((item) => {
      const message = document.createElement('div')
      message.style.display = 'flex'
      message.style.position = 'absolute'
      message.style.zIndex = '1'
      message.style.backgroundColor = 'rgba(62,62,63,0.5)'
      message.style.width = '200px'
      message.style.borderRadius = '50px'
      message.style.right = '-200px'
      message.style.top = `${random(0, 670)}px`
      const animateMessage = () => {
        message.animate([
          { transform: 'translateX(0)' }, // 起始状态
          { transform: 'translateX(-1480px)' } // 结束状态
        ], {
          duration: random(6000, 10000),
          iterations: 1 // 无限循环
        }).onfinish = () => {
          message.style.top = `${random(0, 670)}px`
          animateMessage()
        }
      }
      animateMessage()
      const userHeadPortrait = document.createElement('img')
      userHeadPortrait.src = item.userHeadPortrait
      userHeadPortrait.width = 50
      userHeadPortrait.height = 50
      userHeadPortrait.style.borderRadius = '50px'
      message.appendChild(userHeadPortrait)

      const name = document.createElement('span')
      name.innerText = item.name + ':'
      name.style.fontWeight = '600'
      name.style.lineHeight = '50px'
      message.appendChild(name)

      const content = document.createElement('span')
      content.innerText = item.content
      content.style.lineHeight = '50px'
      message.appendChild(content)


      board.value?.appendChild(message)
      nextTick()
    })
  } else {

  }
})
onMounted(() => {
  handleGetMessages()
})
</script>

<template>
  <div class="messagesBox">

    <section class="board" ref="board">
      <img :src="background" alt="">
      <div>
        <h1>留言板</h1>
        <h4>欢迎留言,你可以在这里畅所欲言</h4>
      </div>
    </section>

    <section class="messagesPublish">
      <div>
        <h1>留下你的评论</h1>
      </div>
      <textarea name="messages" placeholder="请输入你的留言" v-model.trim="content"></textarea>
      <div>
        <button @click="handleOpen()">发表</button>
      </div>
    </section>

    <section class="messagesShow">
      <div class="showTop">
        <h4>评论数量:{{ messagesList.length }}</h4>
      </div>
      <div class="messagesItem" v-for="item of messagesList" :key="item.id">
        <section class="leftSection">
          <img :src="item.userHeadPortrait" alt="">
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
            <span>昵称</span>
            <input type="text" v-model="name">
          </div>
        </div>
        <div class="bottomDiv">
          <div>
            <span>联系地址</span>
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
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .board {
    width: @standardWidth;
    height: 900px * 0.8;
    position: relative;
    color: white;
    margin-bottom: 10px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      border-radius: 10px;
      z-index: 0;
    }

    div {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 1;
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
      resize: none;
      /* 禁止缩放 */
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
      background-color: #f7f7f7;

      .leftSection {
        width: 50px;
        height: 100%;

        img {
          width: 50px;
          height: 50px;
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

  .custom-class {
    background-color: aqua;
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
        label{
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
      div{
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