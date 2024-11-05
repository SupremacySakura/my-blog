<script setup lang="ts">
//导入Vue相关API
import { onMounted, ref, watchEffect, nextTick } from 'vue'
//导入测试图片
import test1 from '@/assets/test1.jpg'
import yxzq from '@/assets/yxzq.jpg'
//导入文章相关API
import { getArticles } from '@/services/apis/articles'
//导入ElementPlus图标
import {
  CloseBold
} from '@element-plus/icons-vue'
//导入ElementPlus相关组件
import { ElImage, ElLoading } from 'element-plus'
//导入处理md文档的库
import VueMarkdown from 'vue-markdown-render'
import MarkdownItHighlight from 'markdown-it-highlightjs'
import 'highlight.js/styles/atom-one-dark.css' // 导入高亮样式

const plugins = [MarkdownItHighlight]
//创建文章类
interface iArticleItem {
  id: number,
  head: string,
  digest: string,
  article: string,
  userHeadPortrait: string,
  name: string,
  time: string,
  cover: string
}
//文章数组
const articlesList = ref<iArticleItem[]>([])
/**
 * 获取文章数据
 */
const handleGetArticles = async () => {
  const res = await getArticles()
  if (+res.data.code === 200) {
    articlesList.value = res.data.data
    //处理空图片
    articlesList.value.forEach((item) => {
      if (!item.userHeadPortrait) {
        item.userHeadPortrait = yxzq
      }
      if (!item.cover) {
        item.cover = test1
      }
    })
  }
}
//右侧展示文章数据
//选中文章
const articleItem = ref<iArticleItem>()

//文章内容
const source = ref('')

//监听文章dom,将选中文章挂载在上面
watchEffect(async () => {
  const htmlContent = articleItem.value?.article as string
  source.value = htmlContent
})
/**
 * 选中一篇文章
 * @param item 文章类
 */
const handleChooseArticle = (item: iArticleItem) => {
  articleItem.value = item
}
/**
 * 清空选中文章
 */
const handleClose = () => {
  articleItem.value = undefined
}
const onError = (item: iArticleItem) => {
  item.cover = test1
  item.userHeadPortrait = yxzq
}
onMounted(async () => {
  //初始化
  const options = {
    lock: true, // 锁定屏幕，禁止操作
    text: '正在加载...(若长时间无法加载出来,请刷新页面)',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 1)',
  }
  const loadingInstance = ElLoading.service(options)
  //初始化
  await handleGetArticles()
  articleItem.value = articlesList.value[0]
  nextTick(() => {
    setTimeout(() => {
      loadingInstance.close()
    }, 0)
  })
})
</script>

<template>
  <div class="articlesBox">
    <!-- 左边文章列表展示 -->
    <section class="leftSection">
      <section class="card" v-for="item of articlesList" :key="item.id" @click="handleChooseArticle(item)"
        :class="{ active: articleItem?.id === item.id }">
        <div class="image">
          <el-image :src="item.cover" alt="封面" class="cover" fit="cover" lazy @error="onError(item)"></el-image>
        </div>
        <div class="shade"></div>
        <div class="info">
          <h2>{{ item.head }}</h2>
          <span class="abstract">{{ item.digest }}</span>
          <div class="author">
            <img :src="item.userHeadPortrait" alt="">
            <span>{{ item.name }}</span>
            <time>{{ item.time }}</time>
          </div>
        </div>
      </section>
    </section>
    <!-- 选中文章展示 -->
    <section class="articleBoard" v-if="articleItem">
      <div class="close">
        <el-button type="danger" :icon="CloseBold" circle @click="handleClose" />
      </div>
      <h2>{{ articleItem.head }}</h2>
      <vue-markdown :source="source" :plugins="plugins"></vue-markdown>
    </section>

  </div>
</template>

<style lang="less" scoped>
.articlesBox {
  min-width: 750px;
  width: 100%;
  height: 100vh;
  padding-top: 90px;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 10px;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  background-color: rgba(247, 247, 247, 1);

  .leftSection {
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
    min-width: 600px;
    height: 90%;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.2),
      /* 上侧阴影 */
      inset 0px -4px 8px rgba(255, 255, 255, 0.5);
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
      min-width: 300px;
      width: 78%;
      height: 200px;
      border-radius: 8px;
      background-color: aliceblue;
      margin: 0 auto;
      display: flex;
      overflow: hidden;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2),
        /* 主阴影 */
        0px 12px 20px rgba(0, 0, 0, 0.15),
        /* 次阴影 */
        0px 24px 40px rgba(0, 0, 0, 0.1);

      /* 远处阴影 */
      transform: scale(1);
      transition: transform 0.8s ease;
      margin-bottom: 30px;
      position: relative;

      &:hover {
        transform: scale(1.1);
      }

      .image {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        position: absolute;
        z-index: 0;
        overflow: hidden;

        .cover {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      }

      .shade {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.1);
      }

      .info {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        // box-sizing: border-box;
        padding: 10px;
        position: absolute;
        z-index: 1;
        color: white;

        .abstract {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .author {
          display: flex;
          align-items: center;

          img {
            width: 50px;
            height: 50px;
            border-radius: 50px;
          }

          time {
            color: rgb(166.2, 168.6, 173.4);
            font-size: 12px;
          }
        }
      }
    }

    .active {
      transform: scale(1.1);
    }
  }

  .articleBoard {
    min-width: 550px;
    flex-grow: 1;
    height: 90%;
    box-sizing: border-box;
    margin-right: 10px;
    margin-left: 40px;
    margin-top: 10px;
    padding: 15px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(224,224,224,1);
    color: black;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;

    /* IE 和 Edge */
    &::-webkit-scrollbar {
      display: none;
      /* Chrome、Safari、Edge */
    }

    .close {
      width: 100%;
      display: flex;
      justify-content: end;
      font-size: 20px;
    }

    p {
      width: 100%;
    }
  }
}
</style>