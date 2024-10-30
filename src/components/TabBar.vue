<script setup lang="ts">
import { useRouter,useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
//路由接口
interface iTabBarItem {
  id: number,
  text: string,
  path: string,
}
const gotoPage = (item:iTabBarItem) => {
  router.push(item.path)
}
//导航栏数组
const tabBarList: iTabBarItem[] = [
  {
    id: 1,
    text: '首页',
    path: '/home'
  },
  {
    id: 2,
    text: '朋友圈',
    path: '/moments'
  },
  {
    id: 3,
    text: '文章',
    path: '/articles'
  },
  {
    id: 4,
    text: '留言板',
    path: '/messages'
  },
  {
    id: 5,
    text: '诗与远方',
    path: '/poetry'
  }
]


</script>

<template>
  <div class="tabBarBox">
    <section class="leftSection">
      <span>余心知秋的博客</span>
    </section>
    <section class="rightSection">
      <ul>
        <li v-for="item of tabBarList" :key="item.id" @click="gotoPage(item)" :class="{'active':route.path===item.path}">{{ item.text }}</li>
      </ul>
    </section>
  </div>
</template>

<style lang="less" scoped>
.tabBarBox {
  width: 100%;
  min-width: 750px;
  height: 80px;
  background-color: rgba(20, 20, 20, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;

  .leftSection {
    font-size: 24px;
    font-weight: 600;
    padding: 10px;
  }

  .rightSection {
    ul {
      display: flex;

      li {
        width: 80px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        margin: 10px;
        border-radius: 5px;

        &:hover {
          background-color: rgba(29, 30, 31, 0.2);
        }
      }

      .active {
        background-color: rgba(29, 30, 31, 0.1);
      }
    }
  }
}
</style>