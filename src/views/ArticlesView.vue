<script setup lang="ts">
// 导入Vue相关API
import { onMounted, ref, nextTick } from 'vue'
// 导入router相关api
import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
const router = useRouter()
// 导入默认图片
import test1 from '@/assets/test1.jpg'
import yxzq from '@/assets/yxzq.jpg'
// 导入文章相关API
import { getArticles, getArticlesNum, getArticleTag } from '@/services/apis/articles'
// 导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  Search
} from '@element-plus/icons-vue'
// 导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options, _optionsWhite } = useAssetStore()
// 导入articles仓库
import { useArticlesStore } from '@/stores/articles'
const { _setArticlesList } = useArticlesStore()
// 导入类型
import type { iArticleItem, iTag } from '@/types'
import { EArticlePhotoType } from '@/types'
// 文章数组
const articlesList = ref<iArticleItem[]>([])
// 文章页码
const page = ref(1)
// 发布文章数量
const articlesNum = ref(0)
/**
 * 获取文章数
 */
const getANum = async () => {
  const res = await getArticleCountByModel[model.value]()
  if (res.data.code === 200) {
    let shouldUpdate = false
    if (articlesNum.value !== res.data.data) {
      shouldUpdate = true
    }
    articlesNum.value = res.data.data
    if (shouldUpdate) {
      initActiveList()
    }
  }
}
// 正在加载
const isLoadingArticles = ref(false)
/**
 * 获取文章数据
 */
const handleGetArticles = async () => {
  isLoadingArticles.value = true
  await getANum()
  if (articlesNum.value === articlesList.value.length) {
    isLoadingArticles.value = false
    return
  }
  articlesList.value = []
  const res = await getArticleByModel[model.value]()
  if (+res.data.code === 200) {
    //处理数据
    res.data.data.forEach((item: any) => {
      item.loading = [true, true]
    })
    isLoading.value = false
    articlesList.value = [...articlesList.value, ...res.data.data]
    _setArticlesList(articlesList.value)
  }
  setTimeout(() => {
    isLoadingArticles.value = false
  }, 0)
}

// 页码切换
enum PageChange {
  left = -1,
  right = 1
}
/**
 * 加载更多文章
 */
const handleGetMore = async (type: PageChange) => {
  if (type === PageChange.left && page.value === 1) {
    return
  }
  if (type === PageChange.right && page.value * 4 >= articlesNum.value) {
    return
  }
  isLoading.value = true
  if (page.value % 4 === 0 && type === PageChange.right) {
    activePage.value++
  }
  if (page.value % 4 === 1 && type === PageChange.left) {
    activePage.value--
  }
  page.value += type
  try {
    await handleGetArticles()
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.log(error)
    if (type = 1) {
      page.value--
    } else if (type = -1) {
      page.value++
    }
  } finally {
    isLoading.value = false
  }
}
/**
 * 跳转置顶页面
 * @param index 页码
 */
const handleGoToPage = async (index: number) => {
  isLoading.value = true
  const oldPage = page.value
  page.value = index
  try {
    await handleGetArticles()
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.log(error)
    page.value = oldPage
  } finally {
    isLoading.value = false
  }
}
// 页码列表
const activeList = ref<number[]>([])
// 当前页码
const activePage = ref(1)
/**
 * 初始化页码列表
 */
const initActiveList = () => {
  activeList.value = []
  for (let i = 1; i <= Math.ceil(articlesNum.value / 4); i++) {
    activeList.value.push(i)
  }
}
// 选中文章
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
          id: articleItem.value.arid
        }
      } as RouteLocationRaw)
    }
    loadingInstance.close()
  }, 500)
}
// 文章错误类型枚举
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
    item.avatar = yxzq
  }
}
/**
 * 处理图片加载
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
// 加载更多状态
const isLoading = ref(false)
// 搜索框
const searchValue = ref('')
// 关键词
const keyWord = ref('')
// 搜索模式枚举
enum SearchType {
  all = 0,
  keyWord = 1,
  tag = 2
}
// 搜索模式
const model = ref<SearchType>(SearchType.all)
// 获取文章策略模式
const getArticleByModel = {
  [SearchType.all]: async () => {
    return await getArticles(page.value)
  },
  [SearchType.keyWord]: async () => {
    return await getArticles(page.value, keyWord.value)
  },
  [SearchType.tag]: async () => {
    return await getArticles(page.value, null, activeTagIdList.value)
  }
}
// 获取文章数量策略模式
const getArticleCountByModel = {
  [SearchType.all]: async () => {
    return await getArticlesNum()
  },
  [SearchType.keyWord]: async () => {
    return await getArticlesNum(keyWord.value)
  },
  [SearchType.tag]: async () => {
    return await getArticlesNum(null, activeTagIdList.value)
  }
}
/**
 * 通过关键词搜索文章
 */
const handleSearchByKeyWord = async () => {
  if (!searchValue.value) {
    model.value = SearchType.all
    keyWord.value = ''
    await handleGetArticles()
    return
  }
  articlesList.value = []
  model.value = SearchType.keyWord
  keyWord.value = searchValue.value
  searchValue.value = ''
  await handleGetArticles()
}

// 标签列表
const tagList = ref<iTag[]>([])
const handleGetTagList = async () => {
  const res = await getArticleTag()
  if (res.data.code === 200) {
    tagList.value = res.data.data
  }
}
// 活跃标签
const activeTagIdList = ref<number[]>([])
/**
 * 选择标签并查询
 * @param id 标签id
 */
const handleSearchByTag = async (id: number) => {
  if (page.value !== 1) {
    page.value = 1
  }
  articlesList.value = []
  if (activeTagIdList.value.includes(id)) {
    activeTagIdList.value = activeTagIdList.value.filter(item => item !== id)
  } else {
    activeTagIdList.value.push(id)
  }
  if (activeTagIdList.value.length !== 0) {
    model.value = SearchType.tag
  } else if (activeTagIdList.value.length === 0) {
    model.value = SearchType.all
  }
  await handleGetArticles()
}
// 初始化
onMounted(async () => {
  const loadingInstance = ElLoading.service(_options)
  try {
    await handleGetArticles()
    await handleGetTagList()
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
  initActiveList()
})
</script>

<template>
  <div class="articlesBox">
    <!-- 文章列表展示 -->
    <section class="mainSection">
      <span class="num">文章数量：{{ articlesNum }}</span>
      <section class="bodySection">
        <div class="utils">
          <div class="search">
            <span>搜索</span>
            <div class="searchInput">
              <el-input v-model="searchValue" style="width: 240px" placeholder="请输入关键词"
                @keyup.enter="handleSearchByKeyWord()" />
              <el-button :icon="Search" @click="handleSearchByKeyWord()" />
            </div>
          </div>
          <div class="tag">
            <span>标签</span>
            <ul>
              <li v-for="(item) of tagList" :key="item.id"
                :class="{ 'active': activeTagIdList.some((e) => e === item.id) }" @click="handleSearchByTag(item.id)">{{
                  item.tag }}</li>
            </ul>
          </div>
        </div>
        <div class="articleList">
          <section class="card" v-show='articlesList.length === 0 && isLoadingArticles === false'
            :style="{ fontSize: '40px', color: 'var(--article-card-text-color)' }">
            未找到相关文章
          </section>
          <section class="card" v-show="isLoadingArticles === true" :style="{ opacity: '0' }">

          </section>
          <section class="card" v-for="(item) of articlesList" :key="item.arid" @click="handleChooseArticle(item)">
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
                <el-image :src="item.avatar || yxzq" alt="" @error="onError(item, ErrorImage.UserHeadPortrait)"
                  class="userHeadPortrait" lazy v-loading="item.loading[EArticlePhotoType.userHeadPortrait]"
                  @load="onImageLoad(item, EArticlePhotoType.userHeadPortrait)" />
                <span>{{ item.username }}</span>
                <time>{{ item.time }}</time>
                <ul class="label">
                  <li v-for="(subItem, subIndex) of item.label" :key="subItem" :class="{ 'hidden': subIndex >= 2 }">
                    <span v-if="subIndex < 2">{{ subItem }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </section>
      <section class="moreSection">
        <ul>
          <li @click="handleGetMore(PageChange.left)" :class="{ 'disabled': page === 1 }">
            <el-icon>
              <ArrowLeft />
            </el-icon>
          </li>
          <li v-for="item of activeList.slice((activePage - 1) * 4, activePage * 4)" :key="item"
            :class="{ 'active': page === item }" @click="handleGoToPage(item)">{{ item }}</li>
          <li @click="handleGetMore(PageChange.right)" :class="{ 'disabled': page * 4 >= articlesNum }">
            <el-icon>
              <ArrowRight />
            </el-icon>
          </li>
        </ul>
        <div class="loader" v-if="isLoading === true"></div>
      </section>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-middle-mobile: 1000px;
@screen-small-mobile: 750px;

.articlesBox {
  .standardBox;
  background: var(--article-background-color);
  transition: background-color 0.3s ease;

  @media screen and (max-width: @screen-middle-mobile) {
    .standardBoxChange;
  }

  .mainSection {
    .standardWidth;
    .innerShadow;
    background-color: var(--article-background-fill-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 20px 0 40px;

    .num {
      display: block;
      width: auto;
      height: 30px;
      line-height: 30px;
      background-color: var(--article-num-background-color);
      margin-top: 20px;
      margin-bottom: 30px;
      padding: 8px 15px;
      border-radius: 30px;
      color: var(--article-card-text-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-weight: 600;
      letter-spacing: 1px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
      }
    }

    @media screen and (max-width: @screen-middle-mobile) {
      padding: 20px 5px 40px 5px;
      width: 100%;
    }

    .bodySection {
      width: 100%;
      display: flex;
      justify-content: space-around;
      gap: 20px;

      @media screen and (max-width: 1300px) {
        flex-wrap: wrap;
      }

      .articleList {
        .card {
          .size(800px, 200px);
          border-radius: 15px;
          background: var(--article-card-background-color);
          margin: 0 auto;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          transform: scale(1);
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          position: relative;

          @media screen and (max-width: @screen-middle-mobile) {
            width: 95%;
          }

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%);
            pointer-events: none;
          }

          &:hover {
            transform: scale(1.03) translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);

            .info h3 {
              color: var(--hover-button-background-color);
            }

            .image .cover {
              transform: scale(1.1);
            }
          }

          .image {
            .size(320px, 180px);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            margin-left: 15px;

            @media screen and (max-width: @screen-middle-mobile) {
              .size(100%, 100%);
              position: absolute;
              z-index: 0;
              margin-left: 0;
            }

            .cover {
              .size(100%, 100%);
              border-radius: 10px;
              object-fit: cover;
              transition: transform 0.8s ease;
            }
          }

          .block {
            display: none;

            @media screen and (max-width: @screen-middle-mobile) {
              .size(100%, 100%);
              display: block;
              position: absolute;
              z-index: 0;
              background-color: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(2px);
            }
          }

          .info {
            .size(380px, 100%);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 20px;
            color: var(--article-card-text-color);

            @media screen and (max-width: @screen-middle-mobile) {
              .size(100%, 100%);
              position: relative;
              z-index: 1;
              color: rgba(255, 255, 255, 1);
              box-sizing: border-box;
            }

            h3 {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 10px;
              transition: color 0.3s ease;

              @media screen and (max-width: @screen-middle-mobile) {
                color: white;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
              }
            }

            .abstract {
              width: 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              line-clamp: 3;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 1.6;
              font-size: 15px;
              max-height: calc(1.6em * 3);
              margin-bottom: 15px;
              opacity: 0.9;

              @media screen and (max-width: @screen-middle-mobile) {
                color: rgba(255, 255, 255, 0.9);
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
              }
            }

            .author {
              display: flex;
              align-items: center;

              .userHeadPortrait {
                min-width: 50px;
                min-height: 50px;
                .avatar(50px);
                margin-right: 15px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
                transition: transform 0.3s ease;

                &:hover {
                  transform: scale(1.1);
                }
              }

              time {
                min-width: 115px;
                color: rgb(166, 169, 173);
                font-size: 13px;
                font-style: italic;

                @media screen and (max-width: @screen-middle-mobile) {
                  color: rgba(255, 255, 255, 0.7);
                }
              }

              .label {
                display: flex;
                max-width: 10em;
                flex-wrap: wrap;
                gap: 5px;

                li {
                  width: auto;
                  display: inline-block;
                  box-sizing: content-box;
                  font-size: 12px;
                  padding: 2px 8px;
                  border-radius: 20px;
                  background-color: rgba(255, 255, 255, 1);
                  color: rgba(255, 0, 0, 1);
                  margin-left: 5px;
                  text-align: center;
                  transition: all 0.3s ease;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

                  &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                  }
                }

                .hidden {
                  display: none;
                }
              }
            }
          }
        }

        // 添加卡片的淡入动画
        .card {
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        .card:nth-child(1) {
          animation-delay: 0.1s;
        }

        .card:nth-child(2) {
          animation-delay: 0.2s;
        }

        .card:nth-child(3) {
          animation-delay: 0.3s;
        }

        .card:nth-child(4) {
          animation-delay: 0.4s;
        }
      }

      .utils {
        width: 300px;
        min-height: 400px;
        border-radius: 15px;
        background-color: var(--search-box-background-color);
        margin-bottom: 30px;
        padding: 20px;
        color: var(--article-card-text-color);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }

        @media screen and (max-width: 1300px) {
          width: 90%;
          min-height: 200px;
        }

        .search {
          width: 100%;
          margin-bottom: 20px;

          h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            position: relative;
            display: inline-block;

            &:after {
              content: '';
              position: absolute;
              bottom: -5px;
              left: 0;
              width: 50%;
              height: 2px;
              background: linear-gradient(90deg, var(--article-card-text-color), transparent);
              border-radius: 2px;
            }
          }

          .searchInput {
            width: 100%;
            display: flex;
            margin-top: 15px;
            gap: 10px;

            input {
              flex: 1;
              height: 40px;
              border-radius: 8px;
              border: 1px solid rgba(0, 0, 0, 0.1);
              padding: 0 15px;
              font-size: 14px;
              outline: none;
              transition: all 0.3s ease;

              &:focus {
                border-color: var(--hover-button-background-color);
                box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
              }
            }

            button {
              height: 40px;
              padding: 0 15px;
              border-radius: 8px;
              background-color: var(--hover-button-background-color);
              color: var(--article-button-text-color);
              border: none;
              cursor: pointer;
              transition: all 0.3s ease;

              &:hover {
                background-color: darken(#409eff, 10%);
                transform: translateY(-2px);
              }

              &:active {
                transform: translateY(1px);
              }
            }
          }
        }

        .tag {
          width: 100%;
          margin-top: 20px;

          h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            position: relative;
            display: inline-block;

            &:after {
              content: '';
              position: absolute;
              bottom: -5px;
              left: 0;
              width: 50%;
              height: 2px;
              background: linear-gradient(90deg, var(--article-card-text-color), transparent);
              border-radius: 2px;
            }
          }

          ul {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;

            li {
              width: auto;
              display: inline-block;
              box-sizing: content-box;
              font-size: 14px;
              padding: 5px 10px;
              border-radius: 20px;
              background-color: rgba(255, 255, 255, 1);
              color: rgba(255, 0, 0, 1);
              text-align: center;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

              &:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
              }
            }

            .active {
              background-color: rgba(236, 245, 255, 1);
              color: rgba(64, 158, 255, 1);
              font-weight: 600;
            }
          }
        }
      }
    }

    .moreSection {
      margin: 20px 0 30px;
      color: var(--article-card-text-color);

      ul {
        display: flex;
        width: 300px;
        justify-content: space-around;
        gap: 10px;

        li {
          .size(40px, 40px);
          background-color: var(--article-background-fill-color);
          text-align: center;
          line-height: 40px;
          cursor: pointer;
          border-radius: 8px;
          color: var(--article-card-text-color);
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          font-weight: 500;

          &:hover:not(.disabled) {
            transform: translateY(-3px);
            background-color: rgba(135, 206, 235, 0.5);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }
        }

        .active {
          background-color: rgba(135, 206, 235, 1);
          color: white;
          font-weight: 600;
        }

        .disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      }
    }
  }
}

/* 加载动画 */
.loader {
  .size(120px, 8px);
  margin: 20px auto;
  background: linear-gradient(90deg, transparent, var(--hover-button-background-color), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }

  100% {
    background-position: 100% 0;
  }
}

/* 淡入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>