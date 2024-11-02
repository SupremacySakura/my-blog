<script setup lang="ts">
//导入Vue相关API
import { onUnmounted, nextTick, onMounted, ref, useTemplateRef } from 'vue'
//导入测试图片
import yxzq from '../../public/yxzq.jpg'
//导入文章相关API
import { getArticlesNum } from '@/services/apis/articles'
//导入网站相关API
import { getTime, getPeople } from '@/services/apis/asset'
//开始前页面dom
const homeBox = useTemplateRef('homeBox')
//开始后页面dom
const myBox = useTemplateRef('myBox')
/**
 * dom上移100vh
 * @param dom 接收一个dom元素
 */
const boxUp = (dom: HTMLElement) => {
  const animateBox = () => {
    dom.animate([
      { transform: 'translateY(0)' }, // 起始状态
      { transform: 'translateY(-100vh)' } // 结束状态
    ], {
      duration: 1000,
      fill: 'forwards'
    })
  }
  animateBox()
}
/**
 * dom下移100vh
 * @param dom 接收一个dom元素
 */
const boxDown = (dom: HTMLElement) => {
  const animateBox = () => {
    dom.animate([
      { transform: 'translateY(-100vh)' }, // 起始状态
      { transform: 'translateY(0)' } // 结束状态
    ], {
      duration: 1000,
      fill: 'forwards'
    })
  }
  animateBox()
}
/**
 * 开始,进入开始后页面
 */
const handleStart = () => {
  //上移
  if (homeBox.value && myBox.value) {
    boxUp(homeBox.value)
    boxUp(myBox.value)
  }
}
/**
 * 结束,进入开始前页面
 */
const handleStop = () => {
  //下移
  if (homeBox.value && myBox.value) {
    boxDown(homeBox.value)
    boxDown(myBox.value)
  }
}
/**
 * 从后端获取文章数,赋值给articlesNum
 */
const getANum = async () => {
  const res = await getArticlesNum()
  if (res.data.code === 200) {
    articlesNum.value = res.data.data
  }
}
//起始时间
const time = ref('')
//时间间隔
const daysDiff = ref(0)
const hoursDiff = ref(0)
const minutesDiff = ref(0)
const secondsDiff = ref(0)
//访客人数
const people = ref(0)
/**
 * 获取起始时间与当前时间,计算出时间间隔并赋值
 */
const getUsingTime = async () => {
  const res = await getTime()
  if (res.data.code === 200) {
    time.value = res.data.data
    const startDate = new Date(time.value + 'Z')
    const endDate = new Date()
    // 计算时间间隔（以毫秒为单位）
    const timeDiff = endDate.getTime() - startDate.getTime()
    secondsDiff.value = Math.floor(timeDiff / 1000)
    minutesDiff.value = Math.floor(secondsDiff.value / 60)
    secondsDiff.value = Math.floor(secondsDiff.value % 60)
    hoursDiff.value = Math.floor(minutesDiff.value / 60)
    minutesDiff.value = Math.floor(minutesDiff.value % 60)
    daysDiff.value = Math.floor(hoursDiff.value / 24)
    hoursDiff.value = Math.floor(hoursDiff.value % 24)
  }
}
/**
 * 获取访客人数,赋值给people
 */
const getPeopleTimes = async () => {
  const res = await getPeople()
  if (res.data.code === 200) {
    people.value = res.data.data
  }
}
//发布文章数量
const articlesNum = ref(0)
//计算时间定时器
let intervalId: number
onMounted(async () => {
  //初始化
  await getANum()
  await getUsingTime()
  //开启定时器计算时间间隔
  intervalId = setInterval(() => {
    secondsDiff.value += 1
    if (secondsDiff.value >= 60) {
      minutesDiff.value += 1
      secondsDiff.value -= 60
      if (minutesDiff.value >= 60) {
        hoursDiff.value += 1
        minutesDiff.value -= 60
        if (hoursDiff.value >= 24) {
          daysDiff.value += 1
          hoursDiff.value -= 24
        }
      }
    }
  }, 1000)
  await getPeopleTimes()
})
onUnmounted(() => {
  //页面销毁清楚定时器
  clearInterval(intervalId)
})
</script>

<template>
  <div class="box">
    <!-- 开始前页面 -->
    <div class="homeBox" ref="homeBox">
      <section class="topSection">
        <h1>这是我的个人工作空间</h1>
        <span>极简主义 实用主义</span>
        <button @click="handleStart()" class="changeButton">开始</button>
      </section>
    </div>
    <!-- 开始后页面 -->
    <div class="myBox" ref="myBox">
      <section class="bottomSection">
        <div class="about">
          <!-- 个人信息 -->
          <section class="user">
            <div>
              <img :src="yxzq" alt="">
              <span>余心知秋</span>
              <p>耗尽</p>
              <span>全栈工程师(主前端)</span>
              <address>2712794459@qq.com</address>
            </div>
          </section>
          <!-- 网站相关信息 -->
          <section class="info">
            <div class="number">
              <h4>发表文章数量:</h4>
              <span>{{ articlesNum }}</span>
            </div>
            <div>
              <h4>本站运行时间</h4>
              <time>{{ daysDiff + 'day' + hoursDiff + 'hour' + minutesDiff + 'min' + secondsDiff + 's' }}</time>
            </div>
            <div>
              <h4>访客数量</h4>
              <span>{{ people }}</span>
            </div>
          </section>

        </div>
        <button @click="handleStop()" class="changeButton">返回</button>
      </section>
    </div>
  </div>
</template>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .homeBox {
    width: 100%;
    min-width: 750px;
    height: 100vh;
    min-height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .topSection {
      display: flex;
      flex-direction: column;
      align-items: center;

      h1,
      span,
      button {
        margin-bottom: 20px;
      }

      h1 {
        font-size: 35px;
        color: rgb(42, 16, 188);
      }


    }
  }

  .myBox {
    width: 100%;
    min-width: 750px;
    height: 100vh;
    min-height: 450px;
    display: flex;
    flex-direction: column;

    .bottomSection {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      .about {
        width: 100%;
        height: 40vh;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;

        .user {
          div {
            width: 300px;
            height: 310px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            border: 1px solid black;
            margin-right: 10px;
            border-radius: 10px;
            padding: 10px;
            box-sizing: border-box;
            background-color: aliceblue;
            box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.2),
              /* 上侧阴影 */
              inset 0px -4px 8px rgba(255, 255, 255, 0.5);
            /* 下侧高光 */
          }

          img {
            width: 80px;
            height: 80px;
            border-radius: 80px;
          }

          p {
            white-space: wrap;
            font-size: 12px;
          }
        }

        .info {
          width: 410px;
          height: 310px;
          display: grid;
          grid-template-columns: 200px 200px;
          grid-template-rows: 150px 150px;
          gap: 10px;

          .number {
            grid-column-start: 1;
            grid-column-end: 3;
            grid-row-start: 1;
            grid-row-end: 2;

            span {
              font-size: 20px;
            }
          }

          div {
            border-radius: 10px;
            background-color: #39393A;
            color: white;
            box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.2),
              /* 上侧阴影 */
              inset 0px -4px 8px rgba(255, 255, 255, 0.5);
            /* 下侧高光 */
            display: flex;
            flex-direction: column;
            padding: 10px;
            justify-content: space-around;

            time {
              white-space: wrap;
            }
          }
        }
      }
    }
  }

  .changeButton {
    width: 80px;
    height: 40px;
    border: none;
    border-radius: 40px;
    background-color: rgb(42, 16, 188);
    color: white;
  }
}
</style>