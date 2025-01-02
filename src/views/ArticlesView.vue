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
import { getArticles, getArticlesNum } from '@/services/apis/articles'
//导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options, _optionsWhite } = useAssetStore()
//导入articles仓库
import { useArticlesStore } from '@/stores/articles'
const { _setArticlesList } = useArticlesStore()
//导入类型
import type { iArticleItem } from '@/types'
import { EArticlePhotoType } from '@/types'
//文章数组
const articlesList = ref<iArticleItem[]>([])
//文章页码
const page = ref(1)
//发布文章数量
const articlesNum = ref(0)
/**
 * 获取文章数
 */
const getANum = async () => {
  const res = await getArticlesNum()
  if (res.data.code === 200) {
    articlesNum.value = res.data.data
  }
}
/**
 * 获取文章数据
 */
const handleGetArticles = async () => {
  await getANum()
  if (articlesNum.value === articlesList.value.length) {
    return
  }
  const res = await getArticles(page.value)
  if (+res.data.code === 200) {
    //处理数据
    res.data.data.forEach((item: any) => {
      item.loading = [true, true]
    })
    isLoading.value = false
    articlesList.value = [...articlesList.value, ...res.data.data]
    _setArticlesList(articlesList.value)
  }
}
/**
 * 获取更多文章
 */
const handleGetMore = async () => {
  page.value += 1
  isLoading.value = true
  try {
    await handleGetArticles()
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.log(error)
    if (page.value > 1) {
      page.value -= 1
    }
  } finally {
    isLoading.value = false
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
 * 
 * @param item 文章类
 * @param type 文章类型
 */
const onImageLoad = (item: iArticleItem, type: EArticlePhotoType) => {
  switch (type) {
    case EArticlePhotoType.userHeadPortrait:
      item.loading[EArticlePhotoType.userHeadPortrait] = false
      break
    case EArticlePhotoType.cover:
      item.loading[EArticlePhotoType.cover] = false
      break
    default:
      break
  }
}
//加载更多状态
const isLoading = ref(false)
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
    <!-- 文章列表展示 -->
    <section class="mainSection">
      <section class="card" v-for="(item, index) of articlesList" :key="item.id" @click="handleChooseArticle(item)">
        <div class="image">
          <el-image :src="item.cover || test1" alt="封面" class="cover" fit="cover" lazy
            @error="onError(item, ErrorImage.Cover)" v-loading="item.loading[EArticlePhotoType.cover]"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            @load="onImageLoad(item, EArticlePhotoType.cover)"></el-image>
        </div>
        <div class="block"></div>
        <div class="info">
          <h2>{{ item.head }}</h2>
          <span class="abstract">{{ item.digest }}</span>
          <div class="author">
            <el-image :src="item.userHeadPortrait || yxzq" alt="" @error="onError(item, ErrorImage.UserHeadPortrait)"
              class="userHeadPortrait" lazy v-loading="item.loading[EArticlePhotoType.userHeadPortrait]"
              @load="onImageLoad(item, EArticlePhotoType.userHeadPortrait)" />
            <span>{{ item.name }}</span>
            <time>{{ item.time }}</time>
            <ul class="label">
              <li v-for="(subItem, subIndex) of item.label" :key="subItem" :class="{ 'hidden': subIndex >= 2 }">
                <span v-if="subIndex < 2">{{ subItem }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="moreSection">
        <el-button v-if="articlesList.length < articlesNum && isLoading === false"
          @click="handleGetMore()">点击加载更多</el-button>
        <span v-else-if="isLoading === false">已经没有更多了</span>
        <div class="loader" v-else></div>
      </section>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-middle-mobile: 1000px;

.articlesBox {
  .standardBox;
  background-color: var(--article-background-color);

  @media screen and (max-width:@screen-middle-mobile) {
    .standardBoxChange;
  }

  .mainSection {
    .standardWidth;
    .innerShadow;
    background-color: var(--article-background-fill-color);
    display: flex;
    flex-direction: column;
    align-items: center;

    @media screen and (max-width:@screen-middle-mobile) {
      padding: 20px 5px 0px 5px;
      width: 100%;
    }

    .card {
      .size(800px, 200px);
      border-radius: 8px;
      background-color: var(--article-card-background-color);
      margin: 0 auto;
      margin-bottom: 30px;
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
      cursor: pointer;

      @media screen and (max-width:@screen-middle-mobile) {
        width: 95%;
      }

      &:hover {
        transform: scale(1.1);
      }

      .image {
        .size(320px, 180px);
        border-radius: 8px;

        @media screen and (max-width:@screen-middle-mobile) {
          .size(100%, 100%);
          position: absolute;
          z-index: 0;
        }

        .cover {
          .size(100%, 100%);
          border-radius: 8px;
        }
      }

      .block {
        display: none;

        @media screen and (max-width:@screen-middle-mobile) {
          .size(100%, 100%);
          display: block;
          position: absolute;
          z-index: 0;
          background-color: rgba(0, 0, 0, 0.5);
        }
      }

      .info {
        .size(380px, 100%);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 10px;
        color: var(--article-card-text-color);

        @media screen and (max-width:@screen-middle-mobile) {
          .size(100%, 100%);
          position: relative;
          z-index: 1;
          color: rgba(255, 255, 255, 1);
          box-sizing: border-box;
        }

        .abstract {
          width: 100%;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          /* 设置显示的行数 */
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.5;
          /* 根据需要调整 */
          max-height: calc(1.5em * 3);
          /* 行高 * 行数 */
        }

        .author {
          display: flex;
          align-items: center;

          .userHeadPortrait {
            min-width: 50px;
            min-height: 50px;
            .avatar(50px);
            margin-right: 5px;
          }

          time {
            min-width: 115px;
            color: rgb(166.2, 168.6, 173.4);
            font-size: 12px;
          }

          .label {
            display: flex;
            max-width: 10em;
            flex-wrap: wrap;

            li {
              width: auto;
              display: inline-block;
              box-sizing: content-box;
              font-size: 16px;
              padding: 0 5px;
              border-radius: 5px;
              background-color: rgba(255, 255, 255, 1);
              color: rgba(255, 0, 0, 1);
              margin-left: 5px;
              margin-top: 5px;
              text-align: center;
            }

            .hidden {
              display: none;
            }
          }
        }
      }
    }

    .moreSection {
      margin-bottom: 10px;
      color: var(--article-card-text-color);
    }
  }
}

/* HTML: <div class="loader"></div> */
.loader {
  .size(120px, 20px);
  background:
    linear-gradient(90deg, #0000, orange) left -50px top 0/50px 20px no-repeat lightblue;
  animation: l2 1s infinite linear;
}

@keyframes l2 {
  100% {
    background-position: right -50px top 0
  }
}
</style>