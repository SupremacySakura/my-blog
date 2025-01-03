<script setup lang="ts">
import { ref, useTemplateRef, onMounted, onBeforeUnmount } from 'vue'
//导入vue路由相关api
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { storeToRefs } from 'pinia'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _setPageStart, _nowPath, _setNowPath } = useAssetStore()
const assetStore = useAssetStore()
const { _pageStart } = storeToRefs(assetStore)
//导入lodash相关API
import { throttle } from 'lodash'
//导入ElementPlus相关内容
import type { DrawerProps } from 'element-plus'

import {
  Fold,
  Expand,
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
const tabBarList = ref<iTabBarItem[]>([
  {
    id: 1,
    text: '首页',
    path: '/home'
  },
  {
    id: 2,
    text: '留言板',
    path: '/messages'
  },
  {
    id: 3,
    text: '动态',
    path: '/moments'
  },
  {
    id: 4,
    text: '文章',
    path: '/articles'
  },
  {
    id: 5,
    text: '朋友们',
    path: '/friends'
  },
  {
    id: 6,
    text: '资源',
    path: '/resources'
  }
])
//隐藏导航栏数组
const hiddenTabBarList = ref<iTabBarItem[]>([
])
//父盒子
const container = useTemplateRef('container')
const handleResize = () => {
  if (!container.value) return
  const offsetWidth = container.value.offsetWidth
  const maxTabLength = Math.floor(offsetWidth / 100)  // 假设每个 tab 占 100px
  console.log('maxTabLength', maxTabLength)
  if (tabBarList.value.length > maxTabLength) {
    // 如果 tabBarList 超过最大显示数量，移除一个 tab 并加入 hiddenTabBarList
    hiddenTabBarList.value.push(tabBarList.value.pop() as iTabBarItem)
  } else if (tabBarList.value.length < maxTabLength && hiddenTabBarList.value.length > 0) {
    // 如果 tabBarList 少于最大显示数量，且 hiddenTabBarList 有元素，移除一个并加入 tabBarList
    tabBarList.value.push(hiddenTabBarList.value.pop() as iTabBarItem)
  }
  if (tabBarList.value.length !== maxTabLength) {
    handleResize()
  } else {
    return
  }
}
//存储当前路由
const nowPath = ref<iTabBarItem>({
  id: 1,
  text: '首页',
  path: '/home'
})

const ExpandStatus = ref(false)
const handleExpand = () => {
  ExpandStatus.value = !ExpandStatus.value
}
const direction = ref<DrawerProps['direction']>('rtl')
onMounted(() => {
  //初始化
  nowPath.value = _nowPath
  if (container.value) {
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container.value)
    // 初始化时也执行一次 resize 逻辑
    handleResize()
  }
})
onBeforeUnmount(() => {
  // 清理副作用
  if (container.value) {
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.disconnect()  // 移除观察器
  }
})
</script>

<template>
  <div class="tabBarBox" :class="{ 'other-page': _pageStart, 'first-page': !_pageStart }">
    <section class="leftSection">
      <span>余心知秋的博客</span>
    </section>
    <section class="rightSection">
      <ul ref="container" class="tabBarList">
        <li v-for="item of tabBarList" :key="item.id" @click="gotoPage(item)"
          :class="{ 'active': route.path === item.path }" ref="containerItem">{{ item.text }}</li>
      </ul>
      <el-button :icon="Expand" circle v-if="ExpandStatus && hiddenTabBarList.length > 0" class="openButton" />
      <el-button :icon="Fold" circle v-else-if="!ExpandStatus && hiddenTabBarList.length > 0" @click="handleExpand()"
        class="openButton" />
      <el-drawer v-model="ExpandStatus" title="导航" :direction="direction">
        <ul class="hiddenTabBarList">
          <li v-for="item of hiddenTabBarList" :key="item.id" @click="gotoPage(item)"
            :class="{ 'active': route.path === item.path }" ref="containerItem">{{ item.text }}</li>
        </ul>
      </el-drawer>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-small-mobile: 750px;
@screen-mini-mobile: 500px;
@max-tarbbar-width: 940px;
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
  color: var(--tabbar-text-color);
  border-bottom: 1px solid var(--tabbar-border-bottom-color);

  .leftSection {
    font-size: 24px;
    font-weight: 600;
    padding: 10px;
  }

  .rightSection {
    display: flex;
    align-items: center;



    .changeBtn {
      display: none;

      @media screen and (max-width:@screen-small-mobile) {
        display: block;
      }
    }

    .tabBarList {
      display: flex;
      overflow: hidden;

      @media screen and (max-width:@max-tarbbar-width) {
        width: 600px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-100px)) {
        width: 500px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-200px)) {
        width: 400px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-300px)) {
        width: 300px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-400px)) {
        width: 200px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-500px)) {
        width: 100px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-600px)) {
        width: 0px;
      }

      @media screen and (min-width:@max-tarbbar-width) {
        width: 600px;
      }

      li {
        min-width: 80px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        margin: 10px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background-color: var(--tabbar-background-hover-color);
        }
      }

      .active {
        background-color: var(--tabbar-background-active-color);
      }
    }

    .hiddenTabBarList {
      li {
        min-width: 80px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background-color: var(--tabbar-background-hover-color);
        }
      }

      .active {
        background-color: var(--tabbar-background-active-color);
      }
    }
  }
}

.first-page {
  background-color: var(--tabbar-first-page-color);
}

.other-page {
  background-color: var(--tabbar-other-page-color);
}

:deep(.openButton) {
  margin-right: 20px
}
</style>