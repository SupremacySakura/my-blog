<script setup lang="ts">
//导入Vue相关API
import { onMounted, ref, useTemplateRef, nextTick, onUnmounted } from 'vue'
//导入图片
import yxzq from '@/assets/yxzq.jpg'
import vueBG from '@/assets/vue.jpg'
import vueIcon from '@/assets/favicon.ico'
import reactIcon from '@/assets/favicon2.ico'
import reactBG from '@/assets/React.jpg'
import elementPlusBG from '@/assets/ElementPlus.jpg'
import elementPlusIcon from '@/assets/element-plus.png'
import nodejsBG from '@/assets/Nodejs.jpg'
import nodejsIcon from '@/assets/nodejs.png'
import axiosBG from '@/assets/axios.jpg'
import axiosIcon from '@/assets/axios.png'
import expressBG from '@/assets/express.jpg'
import expressIcon from '@/assets/express.png'
import harmoneyOsBG from '@/assets/HarmonyOs.jpg'
import harmoneyOsIcon from '@/assets/harmonyos.png'
import uniappBG from '@/assets/uni-app.jpg'
import uniappIcon from '@/assets/uni-app.png'
import typescriptBG from '@/assets/Typescript.jpg'
import typescriptIcon from '@/assets/typescript.png'
//导入ElementPlus相关组件
import { ElImage, ElLoading, ElTooltip } from 'element-plus'
//导入lodash相关API
import { throttle } from 'lodash'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options } = useAssetStore()
//导入moments相关API
import { getMoments } from '@/services/apis/moments'
/**
 * 获取朋友圈列表,并给poetryList赋值
 */
const handleGetMoments = async () => {
  const res = await getMoments()
  if (+res.data.code === 200) {
    momentsList.value = res.data.data
    momentsList.value.forEach((item) => {
      if (!item.userHeadPortrait) {
        item.userHeadPortrait = yxzq
      }
    })
  }
}
//定义朋友圈接口
interface iMomentItem {
  id: number,
  time: string,
  userHeadPortrait: string,
  name: string,
  content: string,

}
//朋友圈数组
const momentsList = ref<iMomentItem[]>([])
//技术栈类型接口
interface iWaterFall {
  id: number,
  photo: string,
  text: string,
  src: string,
  height: number,
  icon: string,
  note: string,
}
//技术栈数据数组
const waterFallList = ref<iWaterFall[]>([
  {
    id: 1,
    photo: vueBG,
    text: 'Vue3',
    src: 'https://cn.vuejs.org/guide/introduction.html',
    height: 250,
    icon: vueIcon,
    note: 'Vue (发音为 /vjuː/，类似 view) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Vue 都可以胜任。',
  },
  {
    id: 2,
    photo: reactBG,
    text: 'React',
    src: 'https://zh-hans.react.dev/',
    height: 255,
    icon: reactIcon,
    note: 'React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发和维护。它专注于构建单页应用程序中的视图层，使用组件化的方式来构建界面，支持高效地更新和渲染用户界面。',
  },
  {
    id: 3,
    photo: nodejsBG,
    text: 'Nodejs',
    src: 'https://nodejs.cn/',
    height: 212.5,
    icon: nodejsIcon,
    note: 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，使得 JavaScript 可以在服务器端运行。它最初由 Ryan Dahl 在 2009 年创建，并通过异步、事件驱动的编程模型来提高性能和扩展性。',
  },
  {
    id: 4,
    photo: elementPlusBG,
    text: 'ElementPlus',
    src: 'https://element-plus.org/zh-CN/guide/design.html',
    height: 212.5,
    icon: elementPlusIcon,
    note: 'Element Plus 是一个基于 Vue 3 的 UI 组件库，提供了丰富的组件和样式，适合构建现代化的 Web 应用。Element Plus 是 Element UI 的升级版，专门为 Vue 3 设计和优化，保持了原有的简洁风格和易用性，同时提升了性能和兼容性。',
  },
  {
    id: 5,
    photo: axiosBG,
    text: 'Axios',
    src: 'https://www.axios-http.cn/',
    height: 226,
    icon: axiosIcon,
    note: 'Axios 是一个基于 Promise 的 JavaScript HTTP 客户端，用于在浏览器和 Node.js 中发送请求，帮助开发者轻松与后端 API 进行通信。它提供了一系列功能，简化了 HTTP 请求的发起、数据处理和错误捕获。',
  },
  {
    id: 6,
    photo: expressBG,
    text: 'Express',
    src: 'https://www.expressjs.com.cn/',
    height: 255,
    icon: expressIcon,
    note: 'Express 是一个简洁而灵活的 Node.js Web 应用框架，用于构建服务器端应用和 API。它提供了丰富的功能和简洁的接口，使得处理路由、中间件、请求和响应变得更加容易，是构建 RESTful API 和 Web 应用的主流选择之一。',
  },
  {
    id: 7,
    photo: harmoneyOsBG,
    text: 'HarmoneyOs',
    src: 'https://www.expressjs.com.cn/',
    height: 256.5,
    icon: harmoneyOsIcon,
    note: 'HarmonyOS(鸿蒙操作系统)是由华为开发的一款面向多种设备的分布式操作系统。它最初于 2019 年发布，旨在打破设备间的边界，提供跨平台的用户体验，使不同设备之间能够无缝连接与协作。HarmonyOS 支持多种设备类型，包括手机、平板、智能家居设备、智能手表、车载系统等。',
  },
  {
    id: 8,
    photo: uniappBG,
    text: 'Uni-app',
    src: 'https://zh.uniapp.dcloud.io/',
    height: 255,
    icon: uniappIcon,
    note: 'UniApp 是一个基于 Vue.js 的跨平台前端框架，主要由 DCloud 开发，用于构建支持多端发布的应用。UniApp 允许开发者使用 Vue.js 语法，通过一次编码生成适配多个平台的应用，包括微信小程序、支付宝小程序、H5、App（iOS 和 Android）、以及各类智能设备小程序。',
  },
  {
    id: 9,
    photo: typescriptBG,
    text: 'Typescript',
    src: 'https://typescript.bootcss.com/',
    height: 255,
    icon: typescriptIcon,
    note: 'TypeScript 是微软开发的一种 JavaScript 超集，它在 JavaScript 基础上添加了静态类型、接口和类等功能。TypeScript 设计的初衷是让 JavaScript 适合大型项目的开发需求，提供更好的代码可读性、可维护性和开发体验。TypeScript 的文件扩展名是 .ts，最终会编译成标准的 JavaScript 文件来执行。',
  },
])
/**
 * 新开窗口打开目标网址
 * @param src 网址
 */
const handleOpen = (src: string) => {
  window.open(src, '_blank');

}
//容器
const waterFallBox = useTemplateRef('waterFallBox')
//每个项
const waterFallItems = useTemplateRef('waterFallItems')
//列数
const rows = ref(0)
//列数类型接口
interface iRowItem {
  id: number,
  height: number,
}
//列数数组
const rowsList = ref<iRowItem[]>([])
//左右间距
const margin = ref(0)
/**
 * 返回[rows,margin],列数与边距
 * @param item 容器DOM
 * @param width 单个item宽度
 */
const getRowAndMargin = (item: HTMLElement, width: number) => {
  const itemWidth = item.offsetWidth
  let rows = Math.floor(itemWidth / width)
  if (rows > waterFallList.value.length) {
    rows = waterFallList.value.length
    const margin = (itemWidth - rows * width) / (rows + 1)
    return [rows, margin]
  }
  const margin = itemWidth % width / (rows + 1)
  return [rows, margin]
}
/**
 * 设置盒子位置
 * @param children waterFall,Dom数组
 * @param maginLeft 左边距
 * @param width Dom宽度
 * @param marginTop 上边距
 */
const setPosition = (children: HTMLElement[], maginLeft: number, width: number, marginTop: number) => {
  children.map((item, index) => {
    const child = item
    //寻找到高度最小的一项,项这一项添加
    const minItem = rowsList.value.reduce((min, current) => current.height < min.height ? current : min, rowsList.value[0])
    child.style.left = `${maginLeft * (minItem.id + 1) + width * (minItem.id - 1)}px`
    child.style.top = `${minItem.height}px`
    rowsList.value[rowsList.value.findIndex(item => item.id === minItem.id)].height += child.offsetHeight + marginTop
  })
}
const newWaterFall = () => {
  if (waterFallBox.value && waterFallItems.value) {
    const children = waterFallItems.value
    nextTick(() => {
      [rows.value, margin.value] = getRowAndMargin(waterFallBox.value as HTMLDivElement, 170)
      rowsList.value = []
      for (let i = 1; i <= rows.value; i++) {
        rowsList.value.push({ id: i, height: 0 })
      }
      setPosition(children, margin.value, 170, 10)
      console.log(rowsList.value)
    })
  }
}
onMounted(async () => {
  //初始化
  const loadingInstance = ElLoading.service(_options)

  await handleGetMoments()
  newWaterFall()
  window.addEventListener('resize', throttle(() => { newWaterFall() }, 1000))
  nextTick(() => {
    setTimeout(() => {
      loadingInstance.close()
    }, 0)
  })
})

</script>

<template>
  <div class="momentsBox">
    <!-- 朋友圈 -->
    <section class="leftSection">
      <div class="card" v-for="item of momentsList" :key="item.id">
        <div class="point">
          <span></span>
        </div>
        <div class="time">
          <time>{{ item.time }}</time>
        </div>
        <div class="line">
          <span></span>
        </div>
        <div class="moment">
          <section>
            <div>
              <el-image :src="item.userHeadPortrait" alt="头像" class="custom-image" fit="cover" lazy></el-image>
              <span>{{ item.name }}</span>
            </div>
            <div>
              {{ item.content }}
            </div>
          </section>
        </div>
      </div>

    </section>
    <!-- 技术栈展示 -->
    <section class="rightSection">
      <h2>相关技术栈</h2>
      <div class="box" ref="waterFallBox">
        <div v-for="item of waterFallList" :key="item.id" class="waterFallItem" :style="{ height: item.height + 'px' }"
          @click="handleOpen(item.src)" ref="waterFallItems">
          <el-image :src="item.photo" alt="背景" class="background" fit="cover" lazy></el-image>
          <div class="shade"></div>
          <el-image :src="item.icon" alt="图标" class="icon" fit="cover" lazy></el-image>
          <span>{{ item.text }}</span>
          <el-tooltip class="box-item" effect="dark" placement="top-start">
            <template #content>{{ item.note }}</template>
            <el-button>了解</el-button>
          </el-tooltip>

        </div>
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
.momentsBox {
  width: 100%;
  min-width: 1000px;
  height: 100vh;
  padding-top: 90px;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 10px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  background-color: rgba(247, 247, 247, 1);

  .leftSection {
    min-width: 750px;
    width: 900px;
    height: 90%;
    box-sizing: border-box;
    margin-bottom: 40px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(224, 224, 224, 1);
    overflow-y: auto;
    box-shadow: inset 0px 8px 16px rgba(0, 0, 0, 0.2),
      /* 上侧阴影 */
      inset 0px -8px 16px rgba(255, 255, 255, 0.5);
    /* 下侧高光 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;

    /* IE 和 Edge */
    &::-webkit-scrollbar {
      display: none;
      /* Chrome、Safari、Edge */
    }
    .card {
      width: 750px;
      height: 300px;
      display: grid;
      grid-template-columns: 50px 700px;
      grid-template-rows: 50px 250px;
      .point {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;

        span {
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 20px;
          background-color: rgb(102.2, 177.4, 255);
        }
      }

      .time {
        display: flex;
        align-items: end;
      }

      .line {
        display: flex;
        justify-content: center;

        span {
          display: block;
          width: 1px;
          height: 100%+20px;
          background-color: rgb(102.2, 177.4, 255);
        }
      }

      .moment {
        padding-top: 10px;
        padding-right: 20px;

        section {
          width: 100%;
          height: 100%;
          background-color: rgba(247, 247, 247, 1);
          border-radius: 10px;
          padding: 10px;
          box-sizing: border-box;

          div:nth-child(1) {
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            .custom-image {
              width: 50px;
              height: 50px;
              border-radius: 25px;
            }
          }

        }
      }
    }
  }

  .rightSection {
    height: 100vh-20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    background-color: rgba(247, 247, 247, 1);
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;

    /* IE 和 Edge */
    &::-webkit-scrollbar {
      display: none;
      /* Chrome、Safari、Edge */
    }

    .box {
      width: 100%;
      height: 100%;
      padding-bottom: 50px;
      position: relative;

      .waterFallItem {
        width: 170px;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        transform: scale(1.0);
        transition: all 0.5s ease;

        &:hover {
          cursor: pointer;
          transform: scale(1.1);
          z-index: 1;
        }

        .background {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
        }

        .shade {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
          background-color: rgba(0, 0, 0, 0.4);
        }

        span {
          color: white;
        }

        .icon {
          width: 50px;
          height: 50px;

        }
      }
    }
  }
}
</style>