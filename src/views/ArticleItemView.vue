<script setup lang="ts">
//导入vue相关api
import { ref, onMounted, useTemplateRef, watchEffect, nextTick } from 'vue'
//导入router相关api
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
//导入工具
import { hljs } from '@/utils/index'
//导入处理markdown的库
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
const articleBody = useTemplateRef('articleBody')
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
 * 返回文章页
 */
const handleGoBack = () => {
  const loadingInstance = ElLoading.service(_optionsWhite)
  setTimeout(() => {
    router.push('/articles')
    loadingInstance.close()
  }, 500)
}
onMounted(() => {
  //初始化
  article.value = _articlesList.filter(item => item.id === +route.params.id)[0]
})
</script>

<template>
  <div class="article-item-box">
    <section class="article-item">
      <el-button round @click="handleGoBack()">返回</el-button>
      <h1>{{ article?.head }}</h1>
      <div ref="articleBody" class="markdown-body"></div>
      <div v-if="!article">404 NOT FOUND</div>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-middle-mobile: 960px;

.article-item-box {
  width: 100%;
  min-height: 100vh;
  padding-top: 80px;
  padding-left: 40px;
  padding-right: 40px;
  background-color: rgba(247, 247, 247, 1);
  display: flex;
  justify-content: center;

  @media screen and (max-width:@screen-middle-mobile) {
    box-sizing: border-box;
  }

  .article-item {
    width: 900px;
    min-height: 100vh;
    background-color: rgba(255, 255, 255, 1);
    padding: 20px;

    @media screen and (max-width:@screen-middle-mobile) {
      width: 95%;
    }
  }
}


:deep(.markdown-body code) {
  display: inline-block;
  padding: 5px;
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

:deep(.markdown-body pre),
:deep(.markdown-body pre code) {
  display: block;
  padding: 5px;
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