<script setup lang="ts">
//导入Vue相关API
import { onMounted, ref, nextTick } from 'vue'
//导入router相关api
import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
const router = useRouter()
//导入默认图片
import test1 from '@/assets/test1.jpg'
import yxzq from '@/assets/yxzq.jpg'
//导入文章相关API
import { getArticles } from '@/services/apis/articles'
//导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options, _optionsWhite } = useAssetStore()
//导入articles仓库
import { useArticlesStore } from '@/stores/articles'
const { _setArticlesList } = useArticlesStore()
//导入类型
import type { iArticleItem } from '@/interface'
//文章数组
const articlesList = ref<iArticleItem[]>([])
/**
 * 获取文章数据
 */
const handleGetArticles = async () => {
  const res = await getArticles()
  if (+res.data.code === 200) {
    articlesList.value = [...articlesList.value, ...res.data.data]
    //处理空图片
    articlesList.value.forEach((item) => {
      if (!item.userHeadPortrait) {
        item.userHeadPortrait = yxzq
      }
      if (!item.cover) {
        item.cover = test1
      }
    })
    _setArticlesList(articlesList.value)
  }
}
//选中文章
const articleItem = ref<iArticleItem>()
/**
 * 选中一篇文章
 * @param item 接收一个文章类
 */
const handleChooseArticle = (item: iArticleItem) => {
  articleItem.value = item
  const loadingInstance = ElLoading.service(_optionsWhite)
  setTimeout(() => {
    if (articleItem.value) {
      router.push({
        name: 'show',
        params: {
          id: articleItem.value.id
        }
      } as RouteLocationRaw)
    }
    loadingInstance.close()
  }, 500)
}
//文章错误类型枚举
enum ErrorImage {
  Cover = 'COVER',
  UserHeadPortrait = 'USERHEADPORTRAIT'
}
/**
 * 处理文章中图片的错误
 * @param item 接收一个文章
 * @param type 接收一个错误类型
 */
const onError = (item: iArticleItem, type: ErrorImage) => {
  if (type === ErrorImage.Cover) {
    item.cover = test1
  } else if (type === ErrorImage.UserHeadPortrait) {
    item.userHeadPortrait = yxzq
  }
}
/**
 * 改变文章图片加载状态
 * @param item 接收一个文章类
 */
const onImageLoad = (item: iArticleItem) => {
  item.loading = false
}
onMounted(async () => {
  //初始化
  const loadingInstance = ElLoading.service(_options)
  try {
    await handleGetArticles()
    //初始化
    articleItem.value = articlesList.value[0]
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
</script>

<template>
  <div class="articlesBox">
    <!-- 左边文章列表展示 -->
    <section class="leftSection">
      <section class="card" v-for="(item, index) of articlesList" :key="item.id" @click="handleChooseArticle(item)">
        <div class="image">
          <el-image :src="item.cover" alt="封面" class="cover" fit="cover" lazy @error="onError(item, ErrorImage.Cover)"
            v-loading="item.loading" element-loading-background="rgba(122, 122, 122, 0.8)"
            @load="onImageLoad(item)"></el-image>
        </div>
        <div class="info">
          <h2>{{ item.head }}</h2>
          <span class="abstract">{{ item.digest }}</span>
          <div class="author">
            <img :src="item.userHeadPortrait" alt="" @error="onError(item, ErrorImage.UserHeadPortrait)">
            <span>{{ item.name }}</span>
            <time>{{ item.time }}</time>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<style lang="less" scoped>
.articlesBox {
  min-width: 750px;
  width: 100%;
  min-height: 100vh;
  padding-top: 80px;
  padding-left: 40px;
  padding-right: 40px;
  box-sizing: border-box;
  display: flex;
  background-color: rgba(247, 247, 247, 1);
  justify-content: center;

  .leftSection {
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
    width: 900px;
    min-height: 100vh;
    background-color: rgba(255, 255, 255, 1);
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;

    /* IE 和 Edge */
    &::-webkit-scrollbar {
      display: none;
      /* Chrome、Safari、Edge */
    }

    box-sizing: border-box;

    .card {
      width: 800px;
      height: 200px;
      border-radius: 8px;
      background-color: aliceblue;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-around;
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

      &:hover {
        transform: scale(1.1);
      }

      .image {
        width: 320px;
        height: 180px;
        border-radius: 8px;

        .cover {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      }

      .info {
        width: 360px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 10px;
        color: rgb(0, 0, 0);

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
  }
}
</style>