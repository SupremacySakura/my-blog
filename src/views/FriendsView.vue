<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options } = useAssetStore()
//导入ElementPlus相关组件
import { ElImage, ElLoading, ElTooltip } from 'element-plus'
import yxzq from '@/assets/yxzq.jpg'
import user from '@/assets/user.png'
//定义友链类型接口
interface iFriendItem {
  id: number,
  userHeadPortrait: string,
  name: string,
  label: string,
  url: string,
}
const friendsList = ref<iFriendItem[]>([
  {
    id: 0,
    userHeadPortrait: yxzq,
    name: '余心知秋',
    label: '一个前端小白的博客111',
    url: 'http://127.0.0.1',
  },
])
const aboutList = ref([
  '🎄不支持网站加载速度慢的，和页面特别不美观的',
  '💖先友后链，申请前请先提前做好本站友情链接',
  '🌈稳定更新，每月至少发布1篇文章',
  '🍧贵站拥有顶级域名，不接受别人二级域名分发的域名',
  '🎯凡内容污秽、暴力的、广告挂马的、违背社会主义核心价值观的勿扰',
  '🍅申请方式请发送邮件申请',
  '🎄网站内别整啥乱七八糟的引流，影响正常阅读'])
  const handleGoPage = (item:iFriendItem)=>{
    window.open(item.url,'_blank')
  }
onMounted(async () => {
  //初始化
  const loadingInstance = ElLoading.service(_options)


  nextTick(() => {
    setTimeout(() => {
      loadingInstance.close()
    }, 0)
  })
})
</script>

<template>
  <div class="friendsBox">
    <section class="cardBox">
      <h2>友链站点</h2>
      <ul class="cardList">
        <li v-for="item of friendsList" :key="item.id" class="cardItem" @click="handleGoPage(item)">
          <el-image :src="item.userHeadPortrait || user" alt="" fit="cover" lazy class="user" />
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
.friendsBox {
  width: 100%;
  min-height: 100vh;
  background-color: rgba(247, 247, 247, 1);
  display: flex;
  justify-content: center;

  .cardBox {
    width: 60%;
    min-height: 100vh;
    background-color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    padding: 20px;
    margin-top: 80px;

    .cardList {
      width: 100%;
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: start;

      .cardItem {
        width: 200px;
        height: 100px;
        margin-left: 20px;
        margin-bottom: 20px;
        background-color: rgba(255, 255, 255, 1);
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
          width: 50px;
          height: 50px;
          border-radius: 50%;

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
    .aboutList{
      width: 100%;
      .aboutItem{
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