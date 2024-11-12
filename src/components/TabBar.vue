<script setup lang="ts">
import { ref, useTemplateRef,onMounted,nextTick } from 'vue'
//导入vue路由相关api
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { storeToRefs } from 'pinia'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _setPageStart,_nowPath,_setNowPath } = useAssetStore()
const assetStore = useAssetStore()
const { _pageStart } = storeToRefs(assetStore)
//导入ElementPlus相关内容
import {
  ArrowLeft,
  ArrowRight,
} from '@element-plus/icons-vue'
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
  nowPath.value = item
  _setNowPath(item)
  if (item.path !== '/home') {
    _setPageStart(true)
  } else {
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
    text: '朋友们',
    path: '/friends'
  }
]
//父盒子
const container = useTemplateRef('container')
//子盒子
const containerItem = useTemplateRef('containerItem')
//存储当前路由
const nowPath = ref<iTabBarItem>({
  id: 1,
  text: '首页',
  path: '/home'
})
const tabLeft = () => {
  if (container.value && containerItem.value) {
    container.value.scrollLeft -= 100
    if (nowPath.value != tabBarList[0]) {
      const index = tabBarList.findIndex((item) => item.id === nowPath.value.id)
      const gotoItem = tabBarList[index - 1]
      if (gotoItem) {
        gotoPage(gotoItem)
      }
    }
  }
}
const tabRight = () => {
  if (container.value && containerItem.value) {
    container.value.scrollLeft += 100
    if (nowPath.value != tabBarList[tabBarList.length]) {
      const index = tabBarList.findIndex((item) => item.id === nowPath.value.id)
      const gotoItem = tabBarList[index + 1]
      if (gotoItem) {
        gotoPage(gotoItem)
      }
    }
  }
}
onMounted(()=>{
  //初始化
  nowPath.value = _nowPath
  nextTick(()=>{
    setTimeout(()=>{
      if (container.value && containerItem.value) {
        const index = tabBarList.findIndex((item) => item.id === nowPath.value.id)
        container.value.scrollBy({
          left: index * 100, // 向左滚动指定的像素
          behavior: 'smooth', // 添加平滑滚动效果
        })
      }
    },0)
  })
})
</script>

<template>
  <div class="tabBarBox" :class="{ 'first-page': _pageStart, 'other-page': !_pageStart }">
    <section class="leftSection">
      <span>余心知秋的博客</span>
    </section>
    <section class="rightSection">
      <el-button type="primary" :icon="ArrowLeft" circle class="changeBtn" @click="tabLeft()" />
      <el-button type="primary" :icon="ArrowRight" circle class="changeBtn" @click="tabRight()" />
      <ul ref="container">
        <li v-for="item of tabBarList" :key="item.id" @click="gotoPage(item)"
          :class="{ 'active': route.path === item.path }" ref="containerItem">{{ item.text }}</li>
      </ul>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-small-mobile: 750px;
@screen-mini-mobile: 500px;

.tabBarBox {
  width: 100vw;
  height: 80px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  /* 添加阴影 */
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

    @media screen and (max-width:@screen-small-mobile) {
      font-size: 20px;
    }
  }

  .rightSection {
    display: flex;
    align-items: center;

    @media screen and (max-width:@screen-small-mobile) {
      width: 200px;
    }

    .changeBtn {
      display: none;

      @media screen and (max-width:@screen-small-mobile) {
        display: block;
      }
    }

    ul {
      display: flex;
      scroll-behavior: smooth;

      @media screen and (max-width:@screen-small-mobile) {
        width: 100px;
        overflow-x: auto;
      }

      li {
        min-width: 80px;
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

.first-page {
  background-color: rgba(255, 255, 255, 1);
}

.other-page {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>