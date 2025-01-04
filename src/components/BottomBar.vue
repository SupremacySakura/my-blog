<script setup lang="ts">
//导入相关图片
import github from '@/assets/github-fill.png'
import csdn from '@/assets/csdn.png'
//定义关于我的接口
interface iAboutItem {
  id: number,
  img: string,
  src: string,
}
const aboutMe: iAboutItem[] = [
  {
    id: 0,
    img: github,
    src: 'https://github.com/SupremacySakura'
  },
  {
    id: 1,
    img: csdn,
    src: 'https://blog.csdn.net/S_gonna'
  }
]
//点击关于我的事件
const handleClick = (item: iAboutItem) => {
  window.open(item.src, '_blanck')
}
</script>

<template>
  <div class="bottomBox">
    <!-- 左边部分 -->
    <section class="leftSection">
      <div>
        <span>版权归属@余心知秋</span>
      </div>
      <div class="beian">
        <span>备案号:</span>
        <a href="https://beian.miit.gov.cn/" target="_blank">渝ICP备2024044515号-1</a>
      </div>
    </section>
    <!-- 右边部分 -->
    <section class="rightSection">
      <h4>关于我的</h4>
      <div class="imgBox">
        <img :src="item.img" alt="" v-for="item of aboutMe" @click="handleClick(item)">
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-small-mobile: 750px;

.bottomBox {
  width: 100vw;
  box-sizing: border-box;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid var(--bottombar-border-top-color);
  background: var(--bottombar-background-color);
  justify-content: space-around;
  padding: 10px;
  color: var(--bottombar-text-color);
  box-shadow: 0px 4px 10px rgba(135, 206, 250, 0.15), 0px -10px 30px rgba(135, 206, 250, 0.3);
  &::before {
      content: '';
      position: absolute;
      top: -5px;
      left: 0;
      right: 0;
      height: 5px;
      background: rgba(135, 206, 250, 0.4);
      filter: blur(3px);
      border-radius: 10px;
    }
  @media screen and (max-width:@screen-small-mobile) {
    height: 60px;
  }

  .leftSection {
    width: 500px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    @media screen and (max-width:@screen-small-mobile) {
      height: 40px;
      font-size: 12px;
    }

    .beian {
      width: 250px;
      height: 26px;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: skyblue;
      overflow: hidden;

      @media screen and (max-width:@screen-small-mobile) {
        width: 200px;
      }

      span {
        height: 100%;
        line-height: 26px;
        text-align: center;
      }

      a {
        color: rgb(255, 255, 255, 1);
        text-decoration: none;
        background-color: #424243;
        line-height: 26px;
        height: 100%;
        padding: 5px;

        &:hover {
          color: rgb(102.2, 177.4, 255);
        }
      }
    }
  }

  .rightSection {
    height: 100%;
    h4 {
      width: 100px;
      text-align: center;
    }

    .imgBox {
      height: 40px;
      display: flex;
      justify-content: space-around;

      @media screen and (max-width:@screen-small-mobile) {
        height: 20px;
      }

      img {
        width: 40px;
        height: 40px;

        @media screen and (max-width:@screen-small-mobile) {
          width: 20px;
          height: 20px;
        }

        &:hover {
          cursor: pointer;
        }
      }
    }

  }
}
</style>