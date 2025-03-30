<script setup lang="ts">
//导入Vue相关API
import { onMounted, ref, nextTick } from 'vue'
//导入默认图片
import yxzq from '@/assets/yxzq.jpg'
import backgroundImg from '@/assets/backgroundImg3.jpg'
//导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options } = useAssetStore()
//导入moments相关API
import { getMoments, getTechnology } from '@/services/apis/moments'
//导入类型
import type { iMomentItem, iWaterFallItem } from '@/types'
/**
 * 获取朋友圈列表
 */
const handleGetMoments = async () => {
  const res = await getMoments()
  if (+res.data.code === 200) {
    momentsList.value = res.data.data
    momentsList.value.forEach((item) => {
      item.loading = true
    })
  }
}
//朋友圈数组
const momentsList = ref<iMomentItem[]>([])
/**
 * 处理朋友圈头像显示错误
 * @param item 接收一个朋友圈类
 */
const onUserImageError = (item: iMomentItem) => {
  item.userHeadPortrait = yxzq
}

/**
 * 朋友圈加载完成
 * @param item 朋友圈类
 */
function onMomentImageLoad(item: iMomentItem) {
  item.loading = false
}
onMounted(async () => {
  //初始化
  const loadingInstance = ElLoading.service(_options)
  try {
    await handleGetMoments()
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
  <div class="momentsBox">
    <!-- 朋友圈 -->
    <section class="leftSection">
      <div class="card" v-for="item of momentsList" :key="item.id">
        <div class="point">
          <span></span>
        </div>
        <div class="time">
          <time>{{ item.time }}</time>
        </div>
        <div class="line">
          <span></span>
        </div>
        <div class="moment">
          <section>
            <div>
              <el-image :src="item.userHeadPortrait || yxzq" alt="头像" class="custom-image" fit="cover" lazy
                @error="onUserImageError(item)" v-loading="item.loading" @load="onMomentImageLoad(item)"></el-image>
              <span>{{ item.name }}</span>
            </div>
            <div>
              {{ item.content }}
            </div>
          </section>
        </div>
      </div>

    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-middle-mobile: 960px;
@screen-small-mobile: 750px;

.momentsBox {
  .standardBox;
  background: var(--moment-background-box-color);
  transition: background-color 0.3s ease;

  @media screen and (max-width: @screen-middle-mobile) {
    .standardBoxChange;
  }

  .leftSection {
    .size(@standardWidth, 100%);
    .innerShadow;
    .standardWidth;
    margin-bottom: 40px;
    background-color: var(--moment-left-background-color);
    border: 1px solid rgba(224, 224, 224, 0.5);
    border-radius: 15px;
    overflow-y: auto;
    color: var(--moment-left-text-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 20px 0;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(102, 177, 255, 0.5);
      border-radius: 3px;
    }

    @media screen and (max-width: @screen-small-mobile) {
      .size(100%, 100vh);
    }

    .card {
      width: 100%;
      min-height: 300px;
      display: grid;
      grid-template-columns: 50px auto;
      grid-template-rows: 50px auto;
      transition: all 0.3s ease;

      &:hover {
        .moment section {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }

        .point span {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(102, 177, 255, 0.7);
        }
      }

      @media screen and (max-width: @screen-middle-mobile) {
        grid-template-columns: 50px auto;
      }

      .point {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;

        span {
          .size(20px, 20px);
          display: block;
          border-radius: 20px;
          background-color: rgb(102, 177, 255);
          box-shadow: 0 0 10px rgba(102, 177, 255, 0.5);
          transition: all 0.3s ease;
        }
      }

      .time {
        display: flex;
        align-items: end;
        padding-bottom: 5px;

        time {
          font-size: 14px;
          color: var(--moment-left-text-color);
          opacity: 0.8;
          font-weight: 500;
          font-style: italic;
          transition: all 0.3s ease;

          &:hover {
            color: rgb(102, 177, 255);
            opacity: 1;
          }
        }
      }

      .line {
        display: flex;
        justify-content: center;

        span {
          display: block;
          width: 2px;
          height: calc(100% + 20px);
          background: linear-gradient(to bottom, rgb(102, 177, 255), rgba(102, 177, 255, 0.3));
          border-radius: 2px;
        }
      }

      .moment {
        padding-top: 10px;
        padding-right: 20px;

        section {
          .size(100%, 100%);
          background: var(--moment-left-background-box-color);
          border-radius: 15px;
          padding: 20px;
          box-sizing: border-box;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            top: 25px;
            left: -10px;
            width: 20px;
            height: 20px;
            background: var(--moment-left-background-box-color);
            transform: rotate(45deg);
            border-radius: 2px;
            z-index: -1;
          }

          div:nth-child(1) {
            display: flex;
            align-items: center;
            margin-bottom: 15px;

            .custom-image {
              .avatar(50px);
              border: 3px solid rgba(255, 255, 255, 0.2);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
              margin-right: 15px;
              transition: transform 0.3s ease;

              &:hover {
                transform: scale(1.1);
              }
            }

            span {
              font-size: 18px;
              font-weight: 600;
              color: var(--moment-left-text-color);
              position: relative;

              &::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 0;
                height: 2px;
                background-color: rgb(102, 177, 255);
                transition: width 0.3s ease;
              }

              &:hover::after {
                width: 100%;
              }
            }
          }

          div:nth-child(2) {
            font-size: 16px;
            line-height: 1.6;
            color: var(--moment-left-text-color);
            opacity: 0.9;
            padding: 5px 0;
            border-top: 1px solid rgba(102, 177, 255, 0.2);
            white-space: pre-wrap;
            word-break: break-word;
          }
        }
      }
    }

    // 添加首个卡片的特殊样式
    .card:first-child {
      .point span {
        background-color: #ff6b6b;
        box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
      }

      .line span {
        background: linear-gradient(to bottom, #ff6b6b, rgba(255, 107, 107, 0.3));
      }

      .moment section {
        border-left: 3px solid #ff6b6b;
      }
    }

    // 添加最后一个卡片的特殊样式
    .card:last-child {
      .line span {
        height: 50%;
      }
    }
  }

  // 添加空状态样式
  .leftSection:empty {
    display: flex;
    justify-content: center;
    align-items: center;

    &::after {
      content: '暂无朋友圈内容';
      font-size: 20px;
      color: var(--moment-left-text-color);
      opacity: 0.5;
    }
  }
}

// 添加加载动画
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(102, 177, 255, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(102, 177, 255, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(102, 177, 255, 0);
  }
}

// 添加淡入动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 为每个卡片添加淡入动画
.card {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.card:nth-child(1) {
  animation-delay: 0.1s;
}

.card:nth-child(2) {
  animation-delay: 0.2s;
}

.card:nth-child(3) {
  animation-delay: 0.3s;
}

.card:nth-child(4) {
  animation-delay: 0.4s;
}

.card:nth-child(5) {
  animation-delay: 0.5s;
}

.card:nth-child(n+6) {
  animation-delay: 0.6s;
}
</style>