<script setup lang="ts">
//导入vue相关api
import { ref, onMounted, useTemplateRef, watchEffect, nextTick, reactive, computed } from 'vue'
//导入router相关api
import { useRoute, useRouter } from 'vue-router'
//导入工具
import { throttle } from 'lodash'
//路由相关实例
const route = useRoute()
const router = useRouter()
//导入工具
import { hljs } from '@/utils/index'
//导入类型
import type { iTocItem } from '@/types/index'
//导入处理markdown的库
import { marked } from 'marked'
//标题索引
const toc = ref<iTocItem[]>([])
//标题索引容器
const catalog = useTemplateRef<HTMLElement>('catalog')
//存储数据
const catalogMap = reactive(new Map())
const catalogNum = computed(() => {
  return Array.from(catalogMap.keys())
})
//活跃目录
let activeAnchor = ref<string>('')
//marked初始化
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
//导入articles仓库
import { useArticlesStore } from '@/stores/articles'
const { _articlesList } = useArticlesStore()
//导入ElementPlus相关组件
import { ElLoading } from 'element-plus'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _optionsWhite } = useAssetStore()
//导入类型
import type { iArticleItem } from '@/types'
//文章
const article = ref<iArticleItem>()
//文章dom
const articleBody = useTemplateRef<HTMLElement>('articleBody')
//渲染文章
watchEffect(async () => {
  if (articleBody.value) {
    if (article.value) {
      articleBody.value.innerHTML = await marked(article.value.article)
      nextTick(() => {
        const codeBlocks = articleBody.value?.querySelectorAll('pre code')
        codeBlocks?.forEach((block) => {
          hljs.highlightElement(block as HTMLElement); // 手动高亮每个代码块
        })
      })
    }
  } else {

  }
})
/**
 * 点击目录跳转
 * @param e 事件
 * @param target 跳转dom
 */
const handleGoTo = (e: MouseEvent, target: HTMLElement) => {
  e.preventDefault()
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}
/**
 * 文章滚动事件处理
 * @param e 鼠标滚轮事件
 */
const handleScroll = (e: Event) => {
  if ((e.target as HTMLElement).scrollTop <= catalogNum.value[0]) {
    activeAnchor.value = catalogMap.get(catalogNum.value[0]).id
  } else if ((e.target as HTMLElement).scrollTop >= catalogNum.value[catalogNum.value.length - 1]) {
    activeAnchor.value = catalogMap.get(catalogNum.value[catalogNum.value.length - 1]).id
  } else {
    for (let i = 0; i < catalogNum.value.length - 1; i++) {
      if ((e.target as HTMLElement).scrollTop >= catalogNum.value[i] && (e.target as HTMLElement).scrollTop < catalogNum.value[i + 1]) {
        activeAnchor.value = catalogMap.get(catalogNum.value[i]).id
      }
    }
  }
  const target = document.querySelector('.active')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}
// 滚动事件节流处理
const throttleSroll = throttle(handleScroll, 100)
/**
 * 返回文章页
 */
const handleGoBack = () => {
  const loadingInstance = ElLoading.service(_optionsWhite)
  setTimeout(() => {
    router.push('/articles')
    loadingInstance.close()
  }, 500)
}
const initCatalog = () => {
  nextTick(() => {
    if (articleBody.value) {
      const headings = articleBody.value.querySelectorAll('h1,h2,h3,h4,h5,h6')
      toc.value = Array.from(headings).map((heading, index) => {
        const id = (heading as HTMLElement).innerText + index
        heading.id = id
        if (index === 0) {
          activeAnchor.value = id
        }
        catalogMap.set((heading as HTMLElement).offsetTop, heading)
        return {
          anchor: id,
          level: parseInt(heading.tagName.substring(1)),
          text: heading.textContent,
          el: heading
        } as iTocItem
      })
    }
  })
}
onMounted(() => {
  //初始化
  article.value = _articlesList.filter(item => item.arid === +route.params.id)[0]
  initCatalog()
})
</script>

<template>
  <div class="article-item-box">
    <section class="catalog" ref="catalog">
      <a :href="`#${item.anchor}`" v-for="item in toc" :style="{
        fontSize: `clamp(${12 + (6 - item.level)}px, ${(1 + (6 - item.level) * 0.2)}vw, ${18 + (6 - item.level)}px)`,
        marginLeft: `clamp(${(item.level - 1) * 10}px, ${(item.level - 1) * 1.5}vw, ${(item.level - 1) * 30}px)`
      }" @click="(e) => { handleGoTo(e, item.el) }" :class="{ 'active': item.el.id === activeAnchor }"
        :key="item.anchor">
        {{ item.text }}
      </a>
    </section>
    <section class="article-item">
      <div>
        <el-button round @click="handleGoBack()">返回</el-button>
      </div>
      <div>
        <h1>{{ article?.head }}</h1>
      </div>
      <ul class="label">
        <li v-for="item of article?.label" :key="item">
          {{ item }}
        </li>
      </ul>
      <div ref="articleBody" class="markdown-body" @scroll="(e) => { throttleSroll(e) }" v-if="article"></div>
      <div class="not-found" v-else>404 NOT FOUND</div>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-small-mobile: 750px;
@screen-middle-mobile: 960px;

.article-item-box {
  width: 100%;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  padding: 80px 40px 0px 40px;
  background-color: var(--article-background-color);
  display: flex;
  justify-content: center;
  color: var(--article-card-text-color);

  @media screen and (max-width:@screen-middle-mobile) {
    padding: 80px 16px 0px 16px;
    height: calc(100vh - 80px);
  }

  .catalog {
    box-sizing: border-box;
    width: 300px;
    height: calc(100vh - 160px);
    overflow-y: auto;
    background-color: var(--catalog-background-color);
    display: flex;
    flex-direction: column;
    padding: 10px;

    @media screen and (max-width:@screen-small-mobile) {
      width: 200px;
    }

    a {
      text-decoration: none;
      border-radius: 5px;
      color: var(--article-item-text-color);
      margin-top: 5px;
      padding: 5px;
    }

    .active {
      background-color: var(--catalog-active-background-color);
    }
  }

  .article-item {
    box-sizing: border-box;
    width: 900px;
    height: calc(100vh - 160px);
    overflow: hidden;
    background-color: var(--article-item-background-fill-color);
    padding: 32px;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(27, 31, 36, 0.04);
    display: flex;
    flex-direction: column;

    @media screen and (max-width:@screen-middle-mobile) {
      width: 100%;
      padding: 24px 16px;
    }

    .el-button {
      margin-bottom: 24px;
      background-color: #f6f8fa;
      border: 1px solid #d0d7de;
      color: #24292f;
      font-size: 14px;
      padding: 5px 16px;
      border-radius: 6px;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: #f3f4f6;
        border-color: #d0d7de;
        transform: translateY(-1px);
      }
    }

    h1 {
      margin: 0 0 16px 0;
      font-size: 32px;
      font-weight: 600;
      line-height: 1.25;
      color: var(--article-item-text-color);
    }

    .label {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 16px 0;

      li {
        display: inline-flex;
        align-items: center;
        font-size: 12px;
        padding: 0 10px;
        height: 24px;
        border-radius: 12px;
        background-color: #ddf4ff;
        color: #0969da;
        font-weight: 500;
        transition: all 0.2s ease-in-out;

        &:hover {
          background-color: #b6e3ff;
        }
      }
    }

    .markdown-body {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      position: relative;
    }

    .not-found {
      text-align: center;
      padding: 48px 0;
      color: #57606a;
      font-size: 24px;
      font-weight: 600;
    }
  }
}
</style>