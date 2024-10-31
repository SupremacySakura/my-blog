<script setup lang="ts">
import { onMounted, ref,useTemplateRef,watchEffect,nextTick } from 'vue'
import test1 from '@/assets/test1.jpg'
import user from '@/assets/user.png'
import { getArticles } from '@/services/apis/articles'
//创建文章类
interface iArticleItem {
  id: number,
  head: string,
  digest: string,
  article: string,
  userHeadPortrait: string,
  name:string,
  time: string,
  cover: string
}
const articlesList = ref<iArticleItem[]>([])
/**
 * 获取文章数据
 */
const handleGetArticles =async ()=>{
  const res = await getArticles()
  if (+res.data.code === 200) {
    articlesList.value = res.data.data
    articlesList.value.forEach((item) => {
      if (!item.userHeadPortrait) {
        item.userHeadPortrait = user
      }
      if(!item.cover){
        item.cover = test1
      }
    })
  }
}
onMounted(async()=>{
 await handleGetArticles()
console.log(articlesList.value)
})
</script>

<template>
  <div class="articlesBox">
    <section class="card" v-for="item of articlesList" :key="item.id" ref="cardList">
      <div class="image">
        <img :src="item.cover" alt="">
      </div>
      <div class="info">
        <h2>{{ item.head }}</h2>
        <span class="abstract">{{ item.digest }}</span>
        <div class="author">
          <img :src="user" alt="">
          <span>{{ item.name }}</span>
          <time>{{ item.time }}</time>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
.articlesBox {
  min-width: 750px;
  width: 100%;
  min-height: 100vh;
  padding-top: 100px;
  padding-left: 40px;
  padding-right: 40px;
  margin-bottom: 60px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .card {
    width: 700px;
    height: 200px;
    border-radius: 8px;
    background-color: aliceblue;
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
    margin-bottom: 20px;
    &:hover{
      transform: scale(1.1);
    }
    .image {
      width: 400px;
      height: 100%;
      border-radius: 8px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
      }
    }

    .info {
      width: 300px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      box-sizing: border-box;
      padding: 10px;

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
</style>