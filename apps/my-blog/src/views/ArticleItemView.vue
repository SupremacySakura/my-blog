<script setup lang="ts">
//导入vue相关api
import { ref, onMounted } from 'vue'
//导入router相关api
import { useRoute } from 'vue-router'
//路由相关实例
const route = useRoute()
//导入articles仓库
import { useArticlesStore } from '@/stores/articles'
const { _articlesList } = useArticlesStore()
//导入类型
import type { iArticleItem } from '@/types'
// 导入飞书文档组件
import FeiShuDoc from '../components/FeiShuDoc.vue'
//文章
const article = ref<iArticleItem>()
onMounted(() => {
  //初始化
  article.value = _articlesList.filter(item => item.arid === +route.params.id)[0]
})
</script>

<template>
  <div class="article-item-box">
    <FeiShuDoc :article_url="article?.article"></FeiShuDoc>
  </div>
</template>

<style lang="less" scoped>
@screen-small-mobile: 750px;
@screen-middle-mobile: 960px;

.article-item-box {
  width: 100%;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  padding: 80px 0px 0px 0px;
  background-color: var(--article-background-color);
  display: flex;
  justify-content: center;
}
</style>