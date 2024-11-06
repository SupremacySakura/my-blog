<script setup lang="ts">
//导入vue路由相关api
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { storeToRefs } from 'pinia'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _setPageStart } = useAssetStore()
const assetStore = useAssetStore()
const { _pageStart } = storeToRefs(assetStore)
//路由接口
interface iTabBarItem {
  id: number,
  text: string,
  path: string,
}
/**
 * 跳转至指定路由
 * @param item 接收一个iTabBarItem类型
 */
const gotoPage = (item: iTabBarItem) => {
  if (item.path !== '/home'&&item.path!=='/poetry'){
    _setPageStart(true)
  }else{
    _setPageStart(false)
  }
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
    text: '分享',
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
  },
  {
    id:6,
    text:'朋友们',
    path:'/friends'
  }
]
</script>

<template>
  <div class="tabBarBox" :class="{'first-page':_pageStart,'other-page':!_pageStart}">
    <section class="leftSection">
      <span>余心知秋的博客</span>
    </section>
    <section class="rightSection">
      <ul>
        <li v-for="item of tabBarList" :key="item.id" @click="gotoPage(item)"
          :class="{ 'active': route.path === item.path }">{{ item.text }}</li>
      </ul>
    </section>
  </div>
</template>

<style lang="less" scoped>
.tabBarBox {
  width: 100%;
  min-width: 750px;
  height: 80px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);/* 添加阴影 */
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
.first-page{
  background-color: rgba(255, 255, 255, 1);
}
.other-page{
  background-color: rgba(255, 255, 255, 0.1);
}
</style>