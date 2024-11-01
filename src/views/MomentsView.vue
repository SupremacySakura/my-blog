<script setup lang="ts">
import { onMounted, ref, useTemplateRef,nextTick, onUnmounted } from 'vue'
import yxzq from '../../public/yxzq.jpg'
import vueBG from '../../public/vue.jpg'
import vueIcon from '../../public/favicon.ico'
import reactIcon from '../../public/favicon2.ico'
import reactBG from '../../public/React.jpg'
import elementPlusBG from '../../public/ElementPlus.jpg'
import elementPlusIcon from '../../public/element-plus.png'
import nodejsBG from '../../public/Nodejs.jpg'
import nodejsIcon from '../../public/nodejs.png'
import { throttle } from 'lodash'
import { getMoments } from '@/services/apis/moments'
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
//定义朋友圈接口
interface iMomentItem {
  id: number,
  time: string,
  userHeadPortrait: string,
  name: string,
  content: string,

}
//朋友圈数组
const momentsList = ref<iMomentItem[]>([])
//技术栈类型接口
interface iWaterFall {
  id: number,
  photo: string,
  text: string,
  src: string,
  height: number,
  icon: string,
}
//数据数组
const waterFallList = ref<iWaterFall[]>([
  {
    id: 1,
    photo: vueBG,
    text: 'Vue3',
    src: 'https://cn.vuejs.org/guide/introduction.html',
    height: 250,
    icon: vueIcon,
  },
  {
    id:2,
    photo: reactBG,
    text: 'React',
    src: 'https://zh-hans.react.dev/',
    height: 255,
    icon: reactIcon,
  },
  {
    id: 3,
    photo: nodejsBG,
    text: 'Nodejs',
    src: 'https://nodejs.cn/',
    height: 212.5,
    icon: nodejsIcon,
  },
  {
    id:4,
    photo: elementPlusBG,
    text: 'ElementPlus',
    src: 'https://element-plus.org/zh-CN/guide/design.html',
    height: 212.5,
    icon: elementPlusIcon,
  }
])
const handleOpen = (src: string) => {
  window.open(src, '_blank');

}
//容器
const waterFallBox = useTemplateRef('waterFallBox')
//每个项
const waterFallItems = useTemplateRef('waterFallItems')
//列数
const rows = ref(0)
//列数类型接口
interface iRowItem {
  id: number,
  height: number,
}
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
  if(rows>waterFallList.value.length){
    rows = waterFallList.value.length
    const  margin = (itemWidth - rows*width)/(rows+1)
    return [rows,margin]
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
    child.style.left = `${maginLeft * (minItem.id + 1) + width * (minItem.id-1)}px`
    child.style.top = `${minItem.height}px`
    rowsList.value[rowsList.value.findIndex(item=>item.id===minItem.id)].height+=child.offsetHeight+marginTop
  })
}
const newWaterFall = ()=>{
  if(waterFallBox.value&&waterFallItems.value){
    const children = waterFallItems.value
    nextTick(()=>{
      [rows.value,margin.value] = getRowAndMargin(waterFallBox.value as HTMLDivElement,170)
      rowsList.value = [] 
      for(let i =1;i<=rows.value;i++){
        rowsList.value.push({id:i,height:0})
      }
      setPosition(children,margin.value,170,10)
      console.log(rowsList.value)
    })
  }
}
onMounted(()=>{
  handleGetMoments()
  newWaterFall()
  window.addEventListener('resize',throttle(()=>{newWaterFall()},1000))
})
</script>

<template>
  <div class="momentsBox">

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
              <img :src="item.userHeadPortrait" alt="">
              <span>{{ item.name }}</span>
            </div>
            <div>
              {{ item.content }}
            </div>
          </section>
        </div>
      </div>

    </section>

    <section class="rightSection">
      <h2>相关技术栈</h2>
      <div class="box" ref="waterFallBox">
        <div v-for="item of waterFallList" :key="item.id" class="waterFallItem" :style="{ height: item.height + 'px' }"
          @click="handleOpen(item.src)" ref="waterFallItems">
          <img :src="item.photo" alt="" class="background">
          <img :src="item.icon" alt="" class="icon">
          <span>{{ item.text }}</span>
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

  .leftSection {
    width: 750px;
    height: 90%;
    box-sizing: border-box;
    margin-bottom: 40px;
    background-color: aliceblue;
    overflow-y: auto;
    box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.2),
      /* 上侧阴影 */
      inset 0px -4px 8px rgba(255, 255, 255, 0.5);
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
          background-color: white;
          border-radius: 10px;
          padding: 10px;
          box-sizing: border-box;

          div:nth-child(1) {
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            img {
              width: 50px;
              height: 50px;
              border-radius: 50px;
            }
          }

        }
      }
    }
  }

  .rightSection {
    height: 100vh;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
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
      position: relative;
      .waterFallItem {
        width: 170px;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .background {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
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