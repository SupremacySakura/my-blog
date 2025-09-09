<script setup lang="ts">
//导入Vue相关API
import { onMounted, ref, useTemplateRef, nextTick, onUnmounted } from 'vue'
//导入默认图片
import backgroundImg from '@/assets/backgroundImg3.jpg'
import github from '@/assets/github-fill.png'
//导入ElementPlus相关组件
import { ElMessage, ElImage, ElTooltip } from 'element-plus'
//导入lodash相关API
import { throttle } from 'lodash'
//导入moments相关API
import { getTechnology } from '@/services/apis/moments'
//导入类型
import type { iWaterFallItem, iRowItem } from '@/types'
import { EWaterFallPhotoType } from '@/types'
/**
 * 获取技术栈列表
 */
const handleGetTechnology = async () => {
    const res = await getTechnology()
    if (+res.data.code === 200) {
        waterFallList.value = res.data.data
        waterFallList.value.forEach((item) => {
            item.loading = [true, true]
        })
    }
}

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
    if (margin < 10) {
        const newRows = rows - 1
        const newMargin = itemWidth % width / rows + width / rows
        return [newRows, newMargin]
    }
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
        child.style.left = `${maginLeft * (minItem.id) + width * (minItem.id - 1)}px`
        child.style.top = `${minItem.height}px`
        rowsList.value[rowsList.value.findIndex(item => item.id === minItem.id)].height += child.offsetHeight + marginTop
    })
}
/**
 * 更新瀑布流
 */
const newWaterFall = () => {
    if (waterFallBox.value && waterFallItems.value) {
        const children = waterFallItems.value
        nextTick(() => {
            [rows.value, margin.value] = getRowAndMargin(waterFallBox.value as HTMLDivElement, 170)
            rowsList.value = []
            for (let i = 1; i <= rows.value; i++) {
                rowsList.value.push({ id: i, height: 0 })
            }
            setPosition(children, margin.value, 170, 20)
        })
    }
}
/**
 * 瀑布流图片加载完成
 * @param item 瀑布流类
 * @param photoType 图片类型
 */
function onImageLoad(item: iWaterFallItem, photoType: EWaterFallPhotoType) {
    switch (photoType) {
        case EWaterFallPhotoType.icon:
            item.loading[EWaterFallPhotoType.icon] = false
            break
        case EWaterFallPhotoType.photo:
            item.loading[EWaterFallPhotoType.photo] = false
            break
        default:
            break
    }
}
/**
 * 处理技术栈图片加载错误
 * @param item 接收一个技术栈类
 */
const onBackgroundImageError = (item: iWaterFallItem) => {
    item.photo = backgroundImg
}
/**
 * 处理技术栈图标加载错误
 * @param item 
 */
const onIconImageError = (item: iWaterFallItem) => {
    item.icon = github
}
let resizeHandler: () => void
onMounted(async () => {
    //初始化
    try {
        await handleGetTechnology()
        newWaterFall()
        resizeHandler = throttle(() => {
            newWaterFall()
        }, 1000)

        window.addEventListener('resize', resizeHandler)
    } catch (error) {
        ElMessage.error(`加载资源失败${error}`)
    }
})
onUnmounted(() => {
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler)
    }
})
</script>

<template>
    <div class="resourceBox">
        <!-- 技术栈展示 -->
        <section class="mainSection">
            <h2>资源</h2>
            <div class="box" ref="waterFallBox">
                <div v-for="item of waterFallList" :key="item.id" class="waterFallItem"
                    :style="{ height: item.height + 'px' }" @click="handleOpen(item.src)" ref="waterFallItems">
                    <el-image :src="item.photo || backgroundImg" alt="背景" class="background" fit="cover" lazy
                        v-loading="item.loading[EWaterFallPhotoType.photo]"
                        @load="onImageLoad(item, EWaterFallPhotoType.photo)"
                        @error="onBackgroundImageError(item)"></el-image>
                    <div class="shade"></div>
                    <el-image :src="item.icon || github" alt="图标" class="icon" fit="cover" lazy
                        v-loading="item.loading[EWaterFallPhotoType.icon]"
                        @load="onImageLoad(item, EWaterFallPhotoType.icon)" @error="onIconImageError(item)"></el-image>
                    <span v-show="item.loading.every(item => item === false)">{{ item.text }}</span>
                    <el-tooltip class="box-item" effect="dark" placement="top-start">
                        <template #content>
                            {{ item.note }}
                        </template>
                        <el-button>了解</el-button>
                    </el-tooltip>

                </div>
            </div>
        </section>
    </div>
</template>

<style lang="less" scoped>
@screen-middle-mobile: 960px;
@screen-small-mobile: 750px;

.resourceBox {
    .standardBox;
    background: var(--moment-background-box-color);
    transition: background-color 0.3s ease;

    @media screen and (max-width: @screen-middle-mobile) {
        .standardBoxChange;
    }

    .mainSection {
        .innerShadow;
        .standardWidth;
        padding: 30px;
        min-width: 180px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        background-color: var(--moment-right-background-color);
        color: var(--moment-right-text-color);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

        @media screen and (max-width: @screen-middle-mobile) {
            width: 100%;
            min-height: 1000px;
            margin-left: 0px;
            padding: 20px 15px;
        }

        h2 {
            margin: 20px 0 30px;
            font-size: 28px;
            font-weight: 600;
            position: relative;
            display: inline-block;

            &::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 0;
                width: 50%;
                height: 3px;
                background: linear-gradient(90deg, var(--moment-right-text-color), transparent);
                border-radius: 2px;
            }
        }

        .box {
            .size(100%, 100%);
            padding-bottom: 50px;
            position: relative;

            .waterFallItem {
                width: 170px;
                position: absolute;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                transform: translateY(0);
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                animation: fadeIn 0.5s ease forwards;
                opacity: 0;

                &:hover {
                    cursor: pointer;
                    transform: translateY(-10px);
                    z-index: 10;
                    box-shadow: 0 15px 30px var(--shadow-color);

                    .icon {
                        transform: scale(1.1);
                    }

                    span {
                        color: var(--hover-button-text-color);
                    }

                    .el-button {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .background {
                    .size(100%, 100%);
                    position: absolute;
                    z-index: -1;
                    object-fit: cover;
                    transition: transform 0.8s ease;

                    &:hover {
                        transform: scale(1.05);
                    }
                }

                .shade {
                    .size(100%, 100%);
                    position: absolute;
                    z-index: 0;
                    background: linear-gradient(to bottom,
                            rgba(0, 0, 0, 0.2) 0%,
                            rgba(0, 0, 0, 0.6) 100%);
                }

                span {
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    margin: 10px 0;
                    text-align: center;
                    padding: 0 10px;
                    position: relative;
                    z-index: 1;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                    transition: all 0.3s ease;
                }

                .icon {
                    .size(60px, 60px);
                    margin-top: 20px;
                    border-radius: 50%;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    position: relative;
                    z-index: 1;
                    transition: all 0.3s ease;
                    background-color: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(5px);
                }

                .el-button {
                    margin: 10px 0 20px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    color: white;
                    font-weight: 500;
                    padding: 8px 15px;
                    border-radius: 20px;
                    position: relative;
                    z-index: 1;
                    transition: all 0.3s ease;
                    opacity: 0.7;
                    transform: translateY(5px);

                    &:hover {
                        background-color: var(--hover-button-background-color);
                        border-color: var(--hover-button-background-color);
                        transform: translateY(-3px) !important;
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    }
                }

                // 为每个项目添加不同的延迟
                &:nth-child(3n+1) {
                    animation-delay: 0.1s;
                }

                &:nth-child(3n+2) {
                    animation-delay: 0.2s;
                }

                &:nth-child(3n+3) {
                    animation-delay: 0.3s;
                }
            }
        }
    }
}

// 添加淡入动画
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 添加工具提示样式
:deep(.el-tooltip__popper) {
    border-radius: 8px !important;
    padding: 10px 15px !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
    max-width: 300px !important;
}
</style>