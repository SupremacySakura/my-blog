<script setup lang="ts">
//导入vue相关api
import { ref, onMounted, nextTick } from 'vue'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options } = useAssetStore()
//导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
//导入默认头像
import user from '@/assets/user.png'
//导入friends相关接口
import { getFriends } from '@/services/apis/friends'
//导入类型
import type { iFriendItem } from '@/types'
//朋友列表
const friendsList = ref<iFriendItem[]>([])
/**
 * 处理朋友图像加载失败
 * @param item 接收一个朋友类
 */
const onError = (item: iFriendItem) => {
  item.userHeadPortrait = user
}
/**
 * 获取朋友列表
 */
const handleGetFriends = async () => {
  const res = await getFriends()
  if (res.data.code === 200) {
    friendsList.value = res.data.data
    friendsList.value.forEach((item) => {
      item.loading = true
    })
  }
}
//公告
const aboutList = ref([
  '🎄不支持网站加载速度慢的，和页面特别不美观的',
  '💖先友后链，申请前请先提前做好本站友情链接',
  '🌈稳定更新，每月至少发布1篇文章',
  '🍧贵站拥有顶级域名，不接受别人二级域名分发的域名',
  '🎯凡内容污秽、暴力的、广告挂马的、违背社会主义核心价值观的勿扰',
  '🍅申请方式请发送邮件申请',
  '🎄网站内别整啥乱七八糟的引流，影响正常阅读'])
/**
 * 跳转到朋友的博客
 * @param item 接收一个朋友类
 */
const handleGoPage = (item: iFriendItem) => {
  window.open(item.url, '_blank')
}
/**
 * 图片加载完成
 * @param item 朋友类
 */
const onImageLoad = (item: iFriendItem) => {
  item.loading = false
}
onMounted(async () => {
  //初始化
  const loadingInstance = ElLoading.service(_options)
  try {
    await handleGetFriends()
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

})
</script>

<template>
  <div class="friendsBox">
    <section class="cardBox">
      <h2>友链站点</h2>
      <ul class="cardList">
        <li v-for="item of friendsList" :key="item.id" class="cardItem" @click="handleGoPage(item)">
          <el-image :src="item.userHeadPortrait || user" alt="头像" fit="cover" lazy class="user" @error="onError(item)"
            v-loading="item.loading" @load="onImageLoad(item)" />
          <div class="info">
            <h4>{{ item.name }}</h4>
            <span>{{ item.label }}</span>
          </div>
        </li>
      </ul>
      <ul class="aboutList">
        <li v-for="item of aboutList" :key="item" class="aboutItem">{{ item }}</li>
      </ul>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-middle-mobile: 960px;

.friendsBox {
  width: 100%;
  min-height: 100vh;
  background-color: var(--friend-background-color);
  display: flex;
  justify-content: center;
  color: var(--friend-text-color);

  .cardBox {
    width: 60%;
    min-height: 100vh;
    background-color: var(--friend-background-fill-color);
    box-sizing: border-box;
    padding: 20px;
    margin-top: 80px;

    @media screen and (max-width:@screen-middle-mobile) {
      width: 95%;
    }

    .cardList {
      width: 100%;
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: start;

      .cardItem {
        .size(200px, 100px);
        margin: 0px 0px 20px 20px;
        background-color: var(--friend-card-background-color);
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-radius: 10px;
        box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
        /* 添加盒子阴影 */
        cursor: pointer;
        transform: scale(1.0);
        transition: all 1s ease;

        &:hover {
          transform: scale(1.1);
        }

        .user {
          .avatar(50px);

          &:hover {
            animation-name: revolve;
            animation-duration: 1s;
            animation-timing-function: linear;
            /* 可选，确保动画平滑 */
          }
        }

        .info {
          width: 120px;

          h4 {
            display: block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          span {
            display: block;
            font-size: 12px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }

    .aboutList {
      width: 100%;

      .aboutItem {
        margin-bottom: 10px;
      }
    }
  }
}

@keyframes revolve {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>