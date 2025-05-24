<script setup lang="ts">
import cloneDeep from 'lodash/cloneDeep'
// 导入vue相关api
import { ref, useTemplateRef, onMounted, onBeforeUnmount } from 'vue'
// 导入路由
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { dealRoutes } from '@/router/route'
// 导入仓库
import { storeToRefs } from 'pinia'
import { useAssetStore } from '@/stores/asset'
const { _setPageStart, _nowPath, _setNowPath } = useAssetStore()
const assetStore = useAssetStore()
const { _pageStart } = storeToRefs(assetStore)
import { useUserStore } from '@/stores/user'
const { _user } = storeToRefs(useUserStore())
const { _clearInfo, _checkLogin } = useUserStore()
// 导入ElementPlus组件
import type { DrawerProps } from 'element-plus'
import {
  Fold,
  Expand,
} from '@element-plus/icons-vue'
// 导入类型
import type { iTabBarItem } from '@/types'

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
// 导航栏数组
const tabBarList = ref<iTabBarItem[]>(cloneDeep(dealRoutes))
// 隐藏导航栏数组
const hiddenTabBarList = ref<iTabBarItem[]>([
])
// 父盒子
const container = useTemplateRef('container')
/**
 * 监听盒子变化,变化后自动将路由添加到导航栏数组或隐藏导航栏数组
 */
const handleResize = () => {
  if (!container.value) return
  const offsetWidth = container.value.offsetWidth
  const maxTabLength = Math.floor(offsetWidth / 100)  // 假设每个 tab 占 100px

  // 如果 tabBarList 太多，移到 hiddenTabBarList
  while (tabBarList.value.length > maxTabLength) {
    hiddenTabBarList.value.push(tabBarList.value.pop() as iTabBarItem)
  }

  // 如果 tabBarList 太少，尝试从 hiddenTabBarList 拿回来
  while (tabBarList.value.length < maxTabLength && hiddenTabBarList.value.length > 0) {
    tabBarList.value.push(hiddenTabBarList.value.pop() as iTabBarItem)
  }
}
// 存储当前路由
const nowPath = ref<iTabBarItem>(dealRoutes[1])
// 隐藏导航栏展开状态
const ExpandStatus = ref(false)
/**
 * 切换隐藏导航栏展开状态
 */
const handleExpand = () => {
  ExpandStatus.value = !ExpandStatus.value
}
// 隐藏导航栏展开方向
const direction = ref<DrawerProps['direction']>('rtl')
// 登出
const handleLogout = () => {
  _clearInfo()
  if (route.name === 'user') {
    router.push('/home')
  }
}
let resizeObserver: ResizeObserver | null = null
onMounted(() => {
  // 初始化
  nowPath.value = _nowPath
  if (container.value) {
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container.value)
    // 初始化时也执行一次 resize 逻辑
    handleResize()
  }
})
onBeforeUnmount(() => {
  // 清理副作用
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <div class="tabBarBox" :class="{ 'other-page': _pageStart, 'first-page': !_pageStart }">
    <!-- 左侧 -->
    <section class="leftSection">
      <span>余心知秋的博客</span>
    </section>
    <!-- 中间 -->
    <section class="middleSection">
      <div v-if="!_user" class="login-wrapper">
        <el-button @click="router.push('/login')" class="login-btn" type="primary">
          <i class="el-icon-user"></i>
          <span>登录</span>
        </el-button>
      </div>
      <div v-else class="user-info">
        <div class="user-profile">
          <el-image :src="_user.avatar" class="user-avatar" fit="cover">
            <template #error>
              <div class="avatar-placeholder">
                {{ _user.username?.charAt(0)?.toUpperCase() }}
              </div>
            </template>
          </el-image>
          <span class="username">{{ _user.username }}</span>
        </div>
        <div class="logout-wrapper">
          <el-button @click="handleLogout" class="logout-btn" type="danger" plain size="small">
            <i class="el-icon-switch-button"></i>
            退出登录
          </el-button>
        </div>
      </div>
    </section>
    <!-- 右侧 -->
    <section class="rightSection">
      <ul ref="container" class="tabBarList">
        <li v-for="item of tabBarList" :key="item.id" @click="gotoPage(item)"
          :class="{ 'active': route.path === item.path }" ref="containerItem">
          <span v-if="_checkLogin() ? true : !item.isNeedLogin">
            {{ item.text }}
          </span>
        </li>
      </ul>
      <el-button :icon="Expand" v-if="ExpandStatus && hiddenTabBarList.length > 0" class="openButton" />
      <el-button :icon="Fold" v-else-if="!ExpandStatus && hiddenTabBarList.length > 0" @click="handleExpand()"
        class="openButton" />
      <el-drawer v-model="ExpandStatus" title="导航" :direction="direction">
        <ul class="hiddenTabBarList">
          <li v-for="item of hiddenTabBarList" :key="item.id" @click="gotoPage(item)"
            :class="{ 'active': route.path === item.path }" ref="containerItem">
            <span v-if="_checkLogin() ? true : !item.isNeedLogin">
              {{ item.text }}
            </span>
          </li>
        </ul>
      </el-drawer>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-small-mobile: 750px;
@screen-mini-mobile: 500px;
@max-tarbbar-width: 1250px;

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

    @media screen and (max-width:@max-tarbbar-width) {
      font-size: 18px;
    }
  }

  .middleSection {
    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      transition: all 0.3s ease;

      @media screen and (max-width:@screen-small-mobile) {
        padding: 4px 8px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        overflow: hidden;
        transition: all 0.3s ease;

        @media screen and (max-width:@screen-small-mobile) {
          width: 30px;
          height: 30px;
        }

        &:hover {
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.4);
        }
      }

      .avatar-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #409eff;
        color: white;
        font-size: 18px;
        font-weight: 500;
      }

      .username {
        font-size: 14px;
        color: var(--tabbar-text-color);
        font-weight: 500;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        @media screen and (max-width:@screen-small-mobile) {
          font-size: 12px;
        }
      }

      .logout-wrapper {
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.2);
        }
      }

      .logout-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        font-size: 13px;
        border-radius: 6px;
        transition: all 0.3s ease;

        @media screen and (max-width:@screen-small-mobile) {
          padding: 4px 8px;
          font-size: 11px;
        }

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        &:active {
          transform: translateY(0);
        }

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .login-wrapper {
      padding: 4px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }

      .login-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 24px;
        font-size: 15px;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
              transparent,
              rgba(255, 255, 255, 0.2),
              transparent);
          transition: 0.5s;
        }

        &:hover {
          background: linear-gradient(135deg, #5a54f1, #8a4dfc);
          transform: scale(1.02);

          &::before {
            left: 100%;
          }
        }

        &:active {
          transform: scale(0.98);
        }

        i {
          font-size: 16px;
        }

        span {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          letter-spacing: 0.5px;
        }
      }
    }

    .logoutBtn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 22px;
      background: #ff3e3e;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 18px;
      font-weight: bold;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
      box-shadow: 0 10px 20px rgba(255, 62, 62, 0.5);

      &:hover {
        background: #ff1e1e;
        transform: scale(1.08);
      }
    }
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
      width: 700px;

      @media screen and (max-width:@max-tarbbar-width) {
        width: 700px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-100px)) {
        width: 600px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-200px)) {
        width: 500px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-300px)) {
        width: 400px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-400px)) {
        width: 300px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-500px)) {
        width: 200px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-600px)) {
        width: 100px;
      }

      @media screen and (max-width:((@max-tarbbar-width)-700px)) {
        width: 0px;
      }

      li {
        // min-width: 80px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        margin: 10px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background-color: var(--tabbar-background-hover-color);
        }

        span {
          display: block;
          min-width: 80px;
        }
      }

      .active {
        background-color: var(--tabbar-background-active-color);
      }
    }

    .hiddenTabBarList {
      li {

        text-align: center;
        line-height: 40px;
        border-radius: 5px;
        cursor: pointer;

        span {
          display: block;
          min-width: 80px;
          height: 40px;
        }

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