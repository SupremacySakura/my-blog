<script setup lang="ts">
//导入Vue相关API
import { onUnmounted, nextTick, onMounted, ref, useTemplateRef, watchEffect } from 'vue'
//导入测试图片
import yxzq from '@/assets/yxzq.jpg'
import backgroundImg from '@/assets/backgroundImg.jpg'
//导入文章相关API
import { getArticlesNum } from '@/services/apis/articles'
//导入网站相关API
import { getTime, getPeople } from '@/services/apis/asset'
import { getMyInformation,getMyLabels } from '@/services/apis/my'
//导入ElementPlus相关组件
import { ElImage, ElLoading } from 'element-plus'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options, _optionsWhite } = useAssetStore()
//导入处理markdown的库
import { marked } from 'marked'
marked.setOptions({
  gfm: true, // 启用 GitHub 风格的 Markdown
  breaks: true // 支持换行符
})
//开始前页面dom
const homeBox = useTemplateRef('homeBox')
//开始后页面dom
const myBox = useTemplateRef('myBox')
/**
 * 开始,进入开始后页面
 */
const handleStart = () => {
  const loadingInstance = ElLoading.service(_optionsWhite)
  nextTick(() => {
    setTimeout(() => {
      pageStart.value = true
      loadingInstance.close()
    }, 500)
  })
}
/**
 * 结束,进入开始前页面
 */
const handleStop = () => {
  const loadingInstance = ElLoading.service(_optionsWhite)

  nextTick(() => {
    setTimeout(() => {
      pageStart.value = false
      loadingInstance.close()
    }, 500)
  })
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

//当前处于页面
const pageStart = ref(true)
//主页文章
const homeArticleHTML = ref('')
const homeArticle = useTemplateRef('homeArticle')
const handleGetMyInformation = async () => {
  const res = await getMyInformation()
  if (res.data.code === 200) {
    myInformation.value = res.data.data
    homeArticleHTML.value = await marked(res.data.data.content)
  }
}
watchEffect(() => {
  if (homeArticle.value) {
    homeArticle.value.innerHTML = homeArticleHTML.value
  }
})
//定义标签接口
interface iLabel {
  id:number,
  text:string,
  color:string,
  backgroundColor:string,
}
const labelList = ref<iLabel[]>([])
/**
 * 获取个人标签
 */
const handleGetMyLabels =async () =>{
  const res = await getMyLabels()
  if (res.data.code === 200) {
   labelList.value = res.data.data
  }
}
//定义个人信息接口
interface iInformation {
  id:number,
  content:string,
  name:string,
  introduce:string,
  identity:string,
  address:string,
}
const myInformation = ref<iInformation>()
onMounted(async () => {
  //初始化
  const loadingInstance = ElLoading.service(_options)
  //初始化
  await getANum()
  await getUsingTime()
  await handleGetMyInformation()
  await handleGetMyLabels()
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
  nextTick(() => {
    setTimeout(() => {
      loadingInstance.close()
    }, 0)
  })
})
onUnmounted(() => {
  //页面销毁清楚定时器
  clearInterval(intervalId)
})
</script>

<template>
  <div class="box">
    <img :src="backgroundImg" alt="" class="background-img" v-show="!pageStart">
    <!-- 开始前页面 -->
    <div class="homeBox" ref="homeBox" v-show="!pageStart">
      <section class="topSection">
        <h1>这是我的个人博客</h1>
        <span>极简主义 实用主义</span>
        <button @click="handleStart()" class="changeButton">开始</button>
      </section>
    </div>
    <!-- 开始后页面 -->
    <div class="myBox" ref="myBox" v-show="pageStart">
      <section class="label">
        <ul>
          <li v-for="item of labelList" :key="item.id" :style="{color:item.color,backgroundColor:item.backgroundColor}">{{ item.text }}</li>
        </ul>
      </section>
      <!-- 左边文章 -->
      <section class="main">
        <div ref="homeArticle" class="markdown-body">
        </div>
      </section>
      <!-- 右边简介 -->
      <section class="bottomSection">
        <div class="about">
          <!-- 个人信息 -->
          <section class="user">
            <div>
              <el-image :src="yxzq" alt="头像" class="custom-image" fit="cover" :preview-src-list="[yxzq]"
                hide-on-click-modal />
              <span>{{ myInformation?.name||'余心知秋' }}</span>
              <p>{{ myInformation?.introduce||'耗尽' }}</p>
              <span>{{ myInformation?.identity||'前端工程师' }}</span>
              <address>{{ myInformation?.address||'2712794459@qq.com' }}</address>
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
@-primary-background-color: rgba(247, 247, 247, 1);
@-primary-background-fill-color: rgba(255, 255, 255, 1);

.box {
  width: 100%;
  min-height: 100vh;
  background-color: @-primary-background-color;

  .background-img {
    width: 100%;
    height: 101vh;
    position: absolute;
  }

  .homeBox {
    width: 100%;
    min-width: 750px;
    height: 100vh;
    min-height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

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
        color: @-primary-background-fill-color;
      }

      span {
        color: white;
      }

    }
  }

  .myBox {
    width: 100%;
    min-width: 750px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    position: relative;

    .label {
      width: 50px;
      min-height: 100vh;
      background-color: @-primary-background-fill-color;
      padding-top: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-right: 2px solid @-primary-background-color;

      ul {
        li {
          display: block;
          width: 40px;
          text-align: center;
          white-space: wrap;
          border-radius: 5px;
          margin-bottom: 10px;
          background-color: @-primary-background-color;
        }
      }
    }

    .main {
      width: 60%;
      min-width: 600px;
      min-height: 100vh;
      background-color: @-primary-background-fill-color;
      padding: 10px;
      padding-top: 90px;
    }

    //右侧
    .bottomSection {
      width: 450px;
      height: 900px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: sticky;
      top: 20px;

      .about {
        width: 100%;
        height: 90%;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .user {
          margin-top: 10px;
          margin-bottom: 10px;

          div {
            width: 410px;
            height: 310px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            background-color: @-primary-background-fill-color;
            border: 1px solid rgba(224, 224, 224, 1);
            border-radius: 10px;
            padding: 10px;
            box-sizing: border-box;
            box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.2),
              /* 上侧阴影 */
              inset 0px -4px 8px rgba(255, 255, 255, 0.5);
            /* 下侧高光 */
          }

          .custom-image {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            overflow: hidden;
            padding: 0;

            :deep(.el-image__inner) {
              /* 设置内部图片为圆形 */
              border-radius: 50%;
              width: 100%;
              /* 确保图片充满整个容器 */
              height: 100%;
              object-fit: cover;
              /* 图片适应容器 */
            }
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
            background-color: @-primary-background-fill-color;
            border: 1px solid rgba(224, 224, 224, 1);
            color: black;
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
    background-color: @-primary-background-fill-color;
    color: black;
    margin-bottom: 20px;
  }
}

:deep(.markdown-body pre),
:deep(.markdown-body code) {
  display: block;
  padding: 10px;
  background-color: #f5f5f5;
  /* 浅灰色背景 */
  border: 1px solid #ddd;
  /* 灰色边框 */
  border-radius: 4px;
  /* 圆角 */
  font-family: monospace;
  /* 等宽字体 */
  overflow-x: auto;
  /* 水平滚动条，适合长代码 */
}
</style>