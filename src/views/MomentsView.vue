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

  @media screen and (max-width:@screen-middle-mobile) {
    .standardBoxChange;
  }

  .leftSection {
    .size(@standardWidth, 100%);
    .innerShadow;
    .standardWidth;
    margin-bottom: 40px;
    background-color: var(--moment-left-background-color);
    border: 1px solid rgba(224, 224, 224, 1);
    overflow-y: auto;
    color: var(--moment-left-text-color);

    @media screen and (max-width:@screen-small-mobile) {
      .size(100%, 100vh);
    }

    .card {
      width: 100%;
      min-height: 300px;
      display: grid;
      grid-template-columns: 50px auto;
      grid-template-rows: 50px auto;

      @media screen and (max-width:@screen-middle-mobile) {
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
          background-color: rgb(102.2, 177.4, 255);
        }
      }

      .time {
        display: flex;
        align-items: end;
      }

      .line {
        display: flex;
        justify-content: center;

        span {
          display: block;
          width: 1px;
          height: (100%+20px);
          background-color: rgb(102.2, 177.4, 255);
        }
      }

      .moment {
        padding-top: 10px;
        padding-right: 20px;

        section {
          .size(100%, 100%);
          background: var(--moment-left-background-box-color);
          border-radius: 10px;
          padding: 10px;
          box-sizing: border-box;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

          div:nth-child(1) {
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            .custom-image {
              .avatar(50px);
            }
          }

        }
      }
    }
  }
}
</style>