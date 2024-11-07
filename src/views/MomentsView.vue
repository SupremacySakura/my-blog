<script setup lang="ts">
//导入Vue相关API
import { onMounted, ref, useTemplateRef, nextTick, onUnmounted } from 'vue'
//导入图片
import yxzq from '@/assets/yxzq.jpg'
import backgroundImg from '@/assets/backgroundImg3.jpg'
//导入ElementPlus相关组件
import { ElImage, ElLoading, ElTooltip } from 'element-plus'
//导入lodash相关API
import { throttle } from 'lodash'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options } = useAssetStore()
//导入moments相关API
import { getMoments,getTechnology } from '@/services/apis/moments'
//导入类型
import type { iMomentItem, iWaterFallItem, iRowItem } from '@/interface'
/**
 * 获取朋友圈列表,并给poetryList赋值
 */
const handleGetMoments = async () => {
  const res = await getMoments()
  if (+res.data.code === 200) {
    momentsList.value = res.data.data
    momentsList.value.forEach((item) => {
      if (!item.userHeadPortrait) {
        item.userHeadPortrait = yxzq
      }
    })
  }
}
const handleGetTechnology =async () => {
  const res = await getTechnology()
  if (+res.data.code === 200) {
    waterFallList.value = res.data.data
  }
}
//朋友圈数组
const momentsList = ref<iMomentItem[]>([])
//技术栈数据数组
const waterFallList = ref<iWaterFallItem[]>([])
/**
 * 新开窗口打开目标网址
 * @param src 网址
 */
const handleOpen = (src: string) => {
  window.open(src, '_blank');

}
//容器
const waterFallBox = useTemplateRef('waterFallBox')
//每个项
const waterFallItems = useTemplateRef('waterFallItems')
//列数
const rows = ref(0)
//列数数组
const rowsList = ref<iRowItem[]>([])
//左右间距
const margin = ref(0)
/**
 * 返回[rows,margin],列数与边距
 * @param item 容器DOM
 * @param width 单个item宽度
 */
const getRowAndMargin = (item: HTMLElement, width: number) => {
  const itemWidth = item.offsetWidth
  let rows = Math.floor(itemWidth / width)
  if (rows > waterFallList.value.length) {
    rows = waterFallList.value.length
    const margin = (itemWidth - rows * width) / (rows + 1)
    return [rows, margin]
  }
  const margin = itemWidth % width / (rows + 1)
  return [rows, margin]
}
/**
 * 设置盒子位置
 * @param children waterFall,Dom数组
 * @param maginLeft 左边距
 * @param width Dom宽度
 * @param marginTop 上边距
 */
const setPosition = (children: HTMLElement[], maginLeft: number, width: number, marginTop: number) => {
  children.map((item, index) => {
    const child = item
    //寻找到高度最小的一项,项这一项添加
    const minItem = rowsList.value.reduce((min, current) => current.height < min.height ? current : min, rowsList.value[0])
    child.style.left = `${maginLeft * (minItem.id + 1) + width * (minItem.id - 1)}px`
    child.style.top = `${minItem.height}px`
    rowsList.value[rowsList.value.findIndex(item => item.id === minItem.id)].height += child.offsetHeight + marginTop
  })
}
const newWaterFall = () => {
  if (waterFallBox.value && waterFallItems.value) {
    const children = waterFallItems.value
    nextTick(() => {
      [rows.value, margin.value] = getRowAndMargin(waterFallBox.value as HTMLDivElement, 170)
      rowsList.value = []
      for (let i = 1; i <= rows.value; i++) {
        rowsList.value.push({ id: i, height: 0 })
      }
      setPosition(children, margin.value, 170, 10)
      console.log(rowsList.value)
    })
  }
}
const onImageLoad = (item:iWaterFallItem) => {
  item.loading = false
}
const onBackgroundImageError = (item: iWaterFallItem) => {
  item.photo = backgroundImg
}
onMounted(async () => {
  //初始化
  const loadingInstance = ElLoading.service(_options)

  await handleGetMoments()
  await handleGetTechnology()
  newWaterFall()
  window.addEventListener('resize', throttle(() => { newWaterFall() }, 1000))
  nextTick(() => {
    setTimeout(() => {
      loadingInstance.close()
    }, 0)
  })
  console.log(waterFallList.value)
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
              <el-image :src="item.userHeadPortrait" alt="头像" class="custom-image" fit="cover" lazy></el-image>
              <span>{{ item.name }}</span>
            </div>
            <div>
              {{ item.content }}
            </div>
          </section>
        </div>
      </div>

    </section>
    <!-- 技术栈展示 -->
    <section class="rightSection">
      <h2>相关技术栈</h2>
      <div class="box" ref="waterFallBox">
        <div v-for="item of waterFallList" :key="item.id" class="waterFallItem" :style="{ height: item.height + 'px' }"
          @click="handleOpen(item.src)" ref="waterFallItems">
          <el-image :src="item.photo" alt="背景" class="background" fit="cover" lazy v-loading="item.loading" @load="onImageLoad(item)" @error="onBackgroundImageError(item)"></el-image>
          <div class="shade"></div>
          <el-image :src="item.icon" alt="图标" class="icon" fit="cover" lazy></el-image>
          <span v-show="!item.loading">{{ item.text }}</span>
          <el-tooltip class="box-item" effect="dark" placement="top-start">
            <template #content>{{ item.note }}</template>
            <el-button>了解</el-button>
          </el-tooltip>

        </div>
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
.momentsBox {
  width: 100%;
  min-width: 1000px;
  height: 100vh;
  padding-top: 90px;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 10px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  background-color: rgba(247, 247, 247, 1);

  .leftSection {
    min-width: 750px;
    width: 900px;
    height: 90%;
    box-sizing: border-box;
    margin-bottom: 40px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(224, 224, 224, 1);
    overflow-y: auto;
    box-shadow: inset 0px 8px 16px rgba(0, 0, 0, 0.2),
      /* 上侧阴影 */
      inset 0px -8px 16px rgba(255, 255, 255, 0.5);
    /* 下侧高光 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;

    /* IE 和 Edge */
    &::-webkit-scrollbar {
      display: none;
      /* Chrome、Safari、Edge */
    }

    .card {
      width: 750px;
      height: 300px;
      display: grid;
      grid-template-columns: 50px 700px;
      grid-template-rows: 50px 250px;

      .point {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;

        span {
          display: block;
          width: 20px;
          height: 20px;
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
          height: 100%+20px;
          background-color: rgb(102.2, 177.4, 255);
        }
      }

      .moment {
        padding-top: 10px;
        padding-right: 20px;

        section {
          width: 100%;
          height: 100%;
          background-color: rgba(247, 247, 247, 1);
          border-radius: 10px;
          padding: 10px;
          box-sizing: border-box;

          div:nth-child(1) {
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            .custom-image {
              width: 50px;
              height: 50px;
              border-radius: 25px;
            }
          }

        }
      }
    }
  }

  .rightSection {
    min-width: 180px;
    height: 100vh-20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    background-color: rgba(247, 247, 247, 1);
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;

    /* IE 和 Edge */
    &::-webkit-scrollbar {
      display: none;
      /* Chrome、Safari、Edge */
    }

    .box {
      width: 100%;
      height: 100%;
      padding-bottom: 50px;
      position: relative;

      .waterFallItem {
        width: 170px;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        transform: scale(1.0);
        transition: all 0.5s ease;

        &:hover {
          cursor: pointer;
          transform: scale(1.1);
          z-index: 1;
        }

        .background {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
        }

        .shade {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
          background-color: rgba(0, 0, 0, 0.4);
        }

        span {
          color: white;
        }

        .icon {
          width: 50px;
          height: 50px;

        }
      }
    }
  }
}
</style>