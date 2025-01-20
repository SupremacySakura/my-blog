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
import { getArticles, getArticlesNum, getArticleTag } from '@/services/apis/articles'
//导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  Search
} from '@element-plus/icons-vue'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options, _optionsWhite } = useAssetStore()
//导入articles仓库
import { useArticlesStore } from '@/stores/articles'
const { _setArticlesList } = useArticlesStore()
//导入类型
import type { iArticleItem, iTag } from '@/types'
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
/**
 * 获取文章数据
 */
const handleGetArticles = async () => {
  await getANum()
  if (articlesNum.value === articlesList.value.length) {
    return
  }
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
}
//页码切换
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
//页码列表
const activeList = ref<number[]>([])
//当前页码
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
//加载更多状态
const isLoading = ref(false)
//搜索框
const searchValue = ref('')
//关键词
const keyWord = ref('')
//搜索模式枚举
enum SearchType {
  all = 0,
  keyWord = 1,
  tag = 2
}
//搜索模式
const model = ref<SearchType>(SearchType.all)
//获取文章策略模式
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
//获取文章数量策略模式
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

//标签列表
const tagList = ref<iTag[]>([])
const handleGetTagList = async () => {
  const res = await getArticleTag()
  if (res.data.code === 200) {
    tagList.value = res.data.data
  }
}
//活跃标签
const activeTagIdList = ref<number[]>([])
/**
 * 选择标签并查询
 * @param id 标签id
 */
const handleSearchByTag = async (id: number) => {
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
//初始化
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
              <el-input v-model="searchValue" style="width: 240px" placeholder="请输入关键词" />
              <el-button :icon="Search" circle @click="handleSearchByKeyWord()" />
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
          <section class="card" v-for="(item) of articlesList.slice((page - 1) * 4, page * 4)" :key="item.id"
            @click="handleChooseArticle(item)">
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
                <el-image :src="item.userHeadPortrait || yxzq" alt=""
                  @error="onError(item, ErrorImage.UserHeadPortrait)" class="userHeadPortrait" lazy
                  v-loading="item.loading[EArticlePhotoType.userHeadPortrait]"
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

.articlesBox {
  .standardBox;
  background: var(--article-background-color);

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

    .num {
      display: block;
      width: auto;
      height: 30px;
      line-height: 30px;
      background-color: var(--article-num-background-color);
      margin-top: 10px;
      margin-bottom: 30px;
      padding: 5px;
      border-radius: 8px;
      color: var(--article-card-text-color);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    @media screen and (max-width:@screen-middle-mobile) {
      padding: 20px 5px 0px 5px;
      width: 100%;
    }

    .bodySection {
      width: 100%;
      display: flex;
      justify-content: space-around;

      @media screen and (max-width:1300px) {
        flex-wrap: wrap;
      }

      .articleList {
        .card {
          .size(800px, 200px);
          border-radius: 8px;
          background: var(--article-card-background-color);
          margin: 0 auto;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
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
      }

      .utils {
        width: 300px;
        height: 890px;
        border-radius: 10px;
        background-color: var(--search-box-background-color);
        margin-bottom: 30px;
        padding: 10px;
        align-items: center;
        color: var(--article-card-text-color);

        @media screen and (max-width:1300px) {
          width: 90%;
          height: 200px;
        }

        .search {
          width: 100%;

          .searchInput {
            width: 100%;
            display: flex;
            margin-top: 10px;
            justify-content: space-around;
          }
        }

        .tag {
          width: 100%;
          margin-top: 10px;

          ul {
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
              cursor: pointer;
            }

            .active {
              background-color: rgba(236, 245, 255, 1);
              color: rgba(64, 158, 255, 1);
            }
          }
        }

      }

    }


    .moreSection {
      margin-bottom: 10px;
      color: var(--article-card-text-color);

      ul {
        display: flex;
        width: 300px;
        justify-content: space-around;

        li {
          .size(40px, 40px);
          background-color: rgba(247, 247, 247, 1);
          text-align: center;
          line-height: 40px;
          cursor: pointer;
          border-radius: 5px;
          color: rgba(0, 0, 0, 1);
          transition: all 0.5s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

          &:hover {
            transform: translateY(-5px);
            background-color: rgba(135, 206, 235, 0.5)
          }
        }

        .active {
          background-color: rgba(135, 206, 235, 1)
        }

        .disabled {
          cursor: not-allowed
        }
      }
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