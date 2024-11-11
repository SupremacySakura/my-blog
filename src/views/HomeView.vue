<script setup lang="ts">
//导入Vue相关API
import { onUnmounted, nextTick, onMounted, ref, useTemplateRef, watchEffect } from 'vue'
//导入默认图片
import yxzq from '@/assets/yxzq.jpg'
import backgroundImg from '@/assets/backgroundImg.jpg'
//导入文章相关API
import { getArticlesNum } from '@/services/apis/articles'
//导入网站相关API
import { getTime, getPeople } from '@/services/apis/asset'
import { getMyInformation, getMyLabels } from '@/services/apis/my'
//导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
//导入pinia相关api
import { storeToRefs } from 'pinia'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options, _optionsWhite, _setPageStart } = useAssetStore()
const assetStore = useAssetStore()
const { _pageStart } = storeToRefs(assetStore)
//导入处理markdown的库
import { marked } from 'marked'
marked.setOptions({
  gfm: true, // 启用 GitHub 风格的 Markdown
  breaks: true // 支持换行符
})
//导入类型
import type { iLabelItem, iInformation } from '@/types'
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
      _setPageStart(true)
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
      _setPageStart(false)
      loadingInstance.close()
    }, 500)
  })
}
/**
 * 获取文章数
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
 * 获取时间间隔
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
 * 获取访客人数
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
//主页文章
const homeArticleHTML = ref('')
const homeArticle = useTemplateRef('homeArticle')
/**
 * 获取个人信息
 */
const handleGetMyInformation = async () => {
  const res = await getMyInformation()
  if (res.data.code === 200) {
    myInformation.value = res.data.data
    if (myInformation.value) {
      myInformation.value.loading = true
    }
    homeArticleHTML.value = await marked(res.data.data.content)
  }
}
watchEffect(() => {
  if (homeArticle.value) {
    homeArticle.value.innerHTML = homeArticleHTML.value
  }
})
//个人标签列表
const labelList = ref<iLabelItem[]>([])
/**
 * 获取个人标签
 */
const handleGetMyLabels = async () => {
  const res = await getMyLabels()
  if (res.data.code === 200) {
    labelList.value = res.data.data
  }
}
//我的个人信息
const myInformation = ref<iInformation>()
/**
 * 处理头像加载失败
 */
const onError = () => {
  if (myInformation.value) {
    myInformation.value.userHeadPortrait = yxzq
  }
}
/**
 * 图片加载完成
 */
const onImageLoad = () => {
  if (myInformation.value) {
    myInformation.value.loading = false
  }

}
onMounted(async () => {
  //初始化
  const loadingInstance = ElLoading.service(_options)
  //初始化
  try {
    await getANum()
    await getUsingTime()
    await handleGetMyInformation()
    await handleGetMyLabels()
    await getPeopleTimes()
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
onUnmounted(() => {
  //页面销毁清楚定时器
  clearInterval(intervalId)
})
</script>

<template>
  <div class="box">
    <img :src="backgroundImg" alt="" class="background-img" v-show="!_pageStart">
    <!-- 开始前页面 -->
    <div class="homeBox" ref="homeBox" v-show="!_pageStart">
      <section class="topSection">
        <h1>这是我的个人博客</h1>
        <span>极简主义 实用主义</span>
        <button @click="handleStart()" class="changeButton">开始</button>
      </section>
    </div>
    <!-- 开始后页面 -->
    <div class="myBox" ref="myBox" v-show="_pageStart">
      <!-- 左侧标签 -->
      <section class="label">
        <ul>
          <li v-for="item of labelList" :key="item.id"
            :style="{ color: item.color, backgroundColor: item.backgroundColor }">
            {{ item.text }}</li>
        </ul>
      </section>
      <!-- 中间文章 -->
      <section class="main">
        <div ref="homeArticle" class="markdown-body">
        </div>
      </section>
      <!-- 右边简介 -->
      <section class="rightSection">
        <div class="about">
          <!-- 个人信息 -->
          <section class="user">
            <div>
              <el-image :src="myInformation?.userHeadPortrait" alt="头像" class="custom-image" fit="cover"
                :preview-src-list="[yxzq]" hide-on-click-modal @error="onError()" v-loading="myInformation?.loading"
                @load="onImageLoad()" />
              <span>{{ myInformation?.name || '余心知秋' }}</span>
              <p>{{ myInformation?.introduce || '耗尽' }}</p>
              <span>{{ myInformation?.identity || '前端工程师' }}</span>
              <address>{{ myInformation?.address || '2712794459@qq.com' }}</address>
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
              <time>{{ daysDiff + '天' + hoursDiff + '小时' + minutesDiff + '分钟' + secondsDiff + '秒' }}</time>
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
@screen-midMobile:1200px;
.box {
  width: 100%;
  min-height: 100vh;
  background-color: @-primary-background-color;

  .background-img {
    width: 100%;
    height: 100vh;
    min-height: 800px;
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
    //左侧
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
    //中间
    .main {
      width: 60%;
      min-width: 600px;
      min-height: 100vh;
      background-color: @-primary-background-fill-color;
      padding: 10px;
      padding-top: 90px;
    }

    //右侧
    .rightSection {
      width: 450px;
      height: 900px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: sticky;
      top: 20px;
      @media screen and (max-width:@screen-midMobile) {
        width: 250px;
      }
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
            @media screen and (max-width:@screen-midMobile) {
                width: 220px;
              }
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
        //右侧下部信息
        .info {
          width: 410px;
          height: 310px;
          display: grid;
          grid-template-columns: 200px 200px;
          grid-template-rows: 150px 150px;
          gap: 10px;
          @media screen and (max-width:@screen-midMobile) {
              width: 220px;
              grid-template-columns: 100px 100px;
            }
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
              width: 100%;
              white-space: normal;
              overflow: hidden;
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