<script setup lang="ts">
// 导入Vue相关API
import { onUnmounted, nextTick, onMounted, ref, useTemplateRef, watchEffect } from 'vue'
// 导入默认图片
import yxzq from '@/assets/yxzq.jpg'
// 导入文章相关API
import { getArticlesNum } from '@/services/apis/articles'
// 导入网站相关API
import { getTime, getPeople } from '@/services/apis/asset'
import { getMyInformation, getMyLabels } from '@/services/apis/my'
// 导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
import {
  Hide,
  View
} from '@element-plus/icons-vue'
// 导入pinia相关api
import { storeToRefs } from 'pinia'
// 导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _optionsWhite, _setPageStart, _setTheme } = useAssetStore()
const assetStore = useAssetStore()
const { _pageStart, _theme } = storeToRefs(assetStore)
// 导入工具
import { hljs } from '@/utils/index'
// 导入处理markdown的库
import { marked } from 'marked'
marked.setOptions({
  gfm: true, // 启用 GitHub 风格的 Markdown
  breaks: true, // 支持换行符
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
})
// 导入类型
import type { iLabelItem, iInformation } from '@/types'
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
    const startDate = new Date(time.value)
    const endDate = new Date()
    // 计算时间间隔（以毫秒为单位）
    const timeDiff = endDate.getTime() - startDate.getTime()
    daysDiff.value = Math.floor(timeDiff / (24 * 3600 * 1000)) || 0
    hoursDiff.value = Math.floor(timeDiff / (3600 * 1000)) % 24 || 0
    minutesDiff.value = Math.floor(timeDiff / (60 * 1000)) % 60 || 0
    secondsDiff.value = Math.floor(timeDiff / 1000) % 60 || 0
  }
}
/**
 * 获取访客人数
 */
const getPeopleTimes = async () => {
  const res = await getPeople()
  if (res.data.code === 200) {
    people.value = res.data.data || 0
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
    (homeArticle.value as HTMLElement).innerHTML = homeArticleHTML.value
    nextTick(() => {
      const codeBlocks = homeArticle.value?.querySelectorAll('pre code')
      codeBlocks?.forEach((block) => {
        hljs.highlightElement(block as HTMLElement); // 手动高亮每个代码块
      })
    })
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
    myInformation.value.avatar = yxzq
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
//主题
const handleChangeTheme = () => {

}
const theme = ref(_theme)
watchEffect(() => {
  _setTheme(theme.value)
})
onMounted(async () => {
  //初始化
  try {
    getANum()
    handleGetMyInformation()
    handleGetMyLabels()
    getPeopleTimes()
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
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.log(error)
  }
})
onUnmounted(() => {
  //页面销毁清楚定时器
  clearInterval(intervalId)
})
</script>

<template>
  <div class="box">
    <!-- 开始前页面 -->
    <div class="homeBox" ref="homeBox" v-show="!_pageStart">
      <section class="topSection">
        <h1 class='head'>这是我的个人博客</h1>
        <span class='label'>极简主义 实用主义</span>
        <button @click="handleStart()" class="changeButton">开始</button>
        <el-switch v-model="theme" :active-action-icon="View" :inactive-action-icon="Hide"
          style="--el-switch-on-color: var(--home-switch-background-color); --el-switch-off-color: var(--home-switch-background-color);--el-switch-border-color: var(--home-switch-border-color);"
          @change="handleChangeTheme" />
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
              <el-image :src="myInformation?.avatar || yxzq" alt="头像" class="custom-image" fit="cover"
                :preview-src-list="[myInformation?.avatar || yxzq]" hide-on-click-modal @error="onError()"
                v-loading="myInformation?.loading" @load="onImageLoad()" />
              <span>{{ myInformation?.username || '余心知秋' }}</span>
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
@screen-middle-mobile: 1200px;
@screen-small-mobile: 750px;
@screen-mini-mobile: 410px;

.box {
  width: 100%;
  min-height: 100vh;
  background: var(--home-background-color);
  transition: background-color 0.3s ease;

  .homeBox {
    .size(100%, 100vh);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    backdrop-filter: blur(3px); // 添加模糊效果

    .topSection {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      border-radius: 10px;

      h1,
      span,
      button {
        margin-bottom: 20px;
      }

      h1 {
        font-size: 35px;
        color: var(--home-head-text-color);
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      span {
        color: var(--home-head-text-color);
        font-size: 18px;
        letter-spacing: 2px;
      }

      .head {
        width: 0;
        overflow: hidden;
        white-space: nowrap;
        border-right: 2px solid black;
        animation: typing 3s steps(8) 1s infinite, blink 0.8s step-end infinite, wait 3.2s 4s forwards;
      }
    }
  }

  .myBox {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    position: relative;
    color: var(--home-text-color);
    gap: 15px; // 添加间距

    @media screen and (max-width: @screen-small-mobile) {
      flex-wrap: wrap;
      gap: 10px;
    }

    // 左侧
    .label {
      width: 60px; // 稍微增加宽度
      min-height: 100vh;
      background-color: var(--home-background-fill-color);
      padding-top: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-right: 2px solid var(--home-background-color);
      border-radius: 0 10px 10px 0;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      overflow-y: auto;

      ul {
        li {
          display: block;
          width: 45px;
          text-align: center;
          white-space: wrap;
          border-radius: 5px;
          margin-bottom: 15px;
          padding: 5px 3px;
          background-color: var(--home-background-color);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;

          &:hover {
            transform: translateX(3px);
          }
        }
      }
    }

    // 中间
    .main {
      width: 60%;
      min-height: 100vh;
      max-height: 100vh;
      background-color: var(--home-article-background-fill-color);
      padding: 20px;
      padding-top: 90px;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
      overflow-y: auto;

      @media screen and (max-width: @screen-small-mobile) {
        width: 70vw;
        padding: 15px;
        padding-top: 90px;
      }

      // 添加滚动条样式
      :deep(.markdown-body) {
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
      }
    }

    // 右侧
    .rightSection {
      .size(450px, 900px);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: sticky;
      top: 20px;

      @media screen and (max-width: @screen-middle-mobile) {
        width: 250px;
      }

      @media screen and (max-width: @screen-small-mobile) {
        width: 450px;
      }

      .about {
        .size(100%, 90%);
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20px; // 添加间距

        .user {
          margin-top: 10px;
          margin-bottom: 10px;
          width: 100%;

          div {
            .innerShadow;
            .size(410px, 310px);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            background-color: var(--home-background-fill-color);
            border: 1px solid rgba(224, 224, 224, 0.5);
            border-radius: 15px;
            padding: 20px;
            box-sizing: border-box;
            transition: transform 0.3s ease, box-shadow 0.3s ease;

            &:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            }

            @media screen and (max-width: @screen-middle-mobile) {
              width: 220px;
            }

            @media screen and (max-width: @screen-small-mobile) {
              width: 90vw;
            }
          }

          .custom-image {
            .avatar(90px); // 稍微增大头像
            overflow: hidden;
            padding: 0;
            border: 3px solid var(--home-background-color);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;

            &:hover {
              transform: scale(1.05);
            }

            :deep(.el-image__inner) {
              .size(100%, 100%);
              border-radius: 50%;
              object-fit: cover;
            }
          }

          p {
            white-space: wrap;
            font-size: 14px;
            line-height: 1.5;
            max-width: 80%;
            text-align: center;
            color: var(--home-text-color);
            opacity: 0.9;
          }

          span {
            font-weight: 600;
            font-size: 18px;
            margin: 5px 0;
          }

          address {
            font-style: normal;
            color: var(--home-text-color);
            opacity: 0.7;
            font-size: 14px;
          }
        }

        // 右侧下部信息
        .info {
          .size(410px, 310px);
          display: grid;
          grid-template-columns: 200px 200px;
          grid-template-rows: 150px 150px;
          gap: 15px;

          @media screen and (max-width: @screen-middle-mobile) {
            width: 220px;
            grid-template-columns: 105px 105px;
            gap: 10px;
          }

          @media screen and (max-width: @screen-small-mobile) {
            width: 90vw;
            grid-template-columns: 49% 49%;
          }

          .number {
            grid-column-start: 1;
            grid-column-end: 3;
            grid-row-start: 1;
            grid-row-end: 2;

            span {
              font-size: 24px;
              font-weight: 600;
              color: var(--home-text-color);
            }
          }

          div {
            .innerShadow;
            border-radius: 15px;
            background-color: var(--home-background-fill-color);
            border: 1px solid rgba(224, 224, 224, 0.5);
            display: flex;
            flex-direction: column;
            padding: 15px;
            justify-content: space-around;
            transition: transform 0.3s ease;

            &:hover {
              transform: translateY(-3px);
              box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
            }

            h4 {
              margin: 0 0 10px 0;
              font-size: 16px;
              color: var(--home-text-color);
              opacity: 0.8;
            }

            time {
              width: 100%;
              white-space: normal;
              overflow: hidden;
              font-size: 15px;
              font-weight: 500;
            }

            span {
              font-size: 18px;
              font-weight: 600;
            }
          }
        }
      }
    }
  }

  .changeButton {
    .size(100px, 45px); // 稍微增大按钮
    border: 1px solid var(--button-border-color);
    border-radius: 40px;
    background-color: var(--home-button-background-color);
    color: var(--home-button-text-color);
    margin-bottom: 20px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    animation: fadeIn 1s forwards;
    font-weight: 500;
    letter-spacing: 1px;

    &:hover {
      background-color: var(--hover-button-background-color);
      color: var(--hover-button-text-color);
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(1px);
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  to {
    width: 8em;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
    /* 光标闪烁 */
  }
}

/* 定义等待动画 */
@keyframes wait {
  0% {
    width: 8em;
    /* 保持显示的内容不变 */
  }

  50% {
    border-color: 2px solid black;
  }

  100% {
    width: 8em;
    /* 保持显示的内容不变 */
    border-color: transparent;
    /* 光标闪烁 */
  }
}
</style>