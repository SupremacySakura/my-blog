<script setup lang="ts">
import { ref, onMounted, useTemplateRef, watchEffect, nextTick } from 'vue'
import background from '@/assets/messageBackground.jpeg'
import user from '@/assets/user.png'
import { random } from '@/utils'
import { getMessages } from '@/services/apis/messages'
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
const handleGetMessages = async()=>{
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
      <textarea name="messages" placeholder="请输入你的留言"></textarea>
      <div>
        <button>发表</button>
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
        div{
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
}

.moveDiv {
  width: 200px;
  border-radius: 50px;
  display: flex;
  position: absolute;
  z-index: 1;
  background-color: rgba(62, 62, 63, 0.5);
  animation: move 5s linear infinite;
  /* 调用动画 */
}

@keyframes move {
  0% {
    transform: translateX(0px);
  }

  50% {
    transform: translateX(-500px);
  }

  100% {
    transform: translateX(-1480px);
  }
}
</style>