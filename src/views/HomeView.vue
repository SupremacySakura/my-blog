<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import yxzq from '../../public/yxzq.jpg'
const homeBox = useTemplateRef('homeBox')
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
const handleStart = () => {
  //上移
  if (homeBox.value && myBox.value) {
    boxUp(homeBox.value)
    boxUp(myBox.value)
  }
}
const handleStop = () => {
  //下移
  if (homeBox.value && myBox.value) {
    boxDown(homeBox.value)
    boxDown(myBox.value)
  }
}
</script>

<template>
  <div class="box">
    <div class="homeBox" ref="homeBox">
      <section class="topSection">
        <h1>这是我的个人工作空间</h1>
        <span>极简主义 实用主义</span>
        <button @click="handleStart()" class="changeButton">开始</button>
      </section>
    </div>
    <div class="myBox" ref="myBox">
      <section class="bottomSection">
        <div class="about">
          <section class="user">
            <div>
              <img :src="yxzq" alt="">
              <span>余心知秋</span>
              <p>耗尽</p>
              <span>全栈工程师(主前端)</span>
              <address>2712794459@qq.com</address>
            </div>
          </section>
          <section class="info">
            <div class="number">
              <h4>发表文章数量:</h4>
              <span>30</span>
            </div>
            <div>
              <h4>本站运行时间</h4>
              <time>10h30min20s</time>
            </div>
            <div>
              <h4>访客数量</h4>
              <span>5</span>
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