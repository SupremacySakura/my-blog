<script setup lang="ts">
//导入Vue相关API
import { onMounted, ref, useTemplateRef, nextTick } from 'vue'
//导入默认图片
import backgroundImg from '@/assets/backgroundImg3.jpg'
//导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading, ElTooltip } from 'element-plus'
//导入lodash相关API
import { throttle } from 'lodash'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options } = useAssetStore()
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
onMounted(async () => {
    //初始化
    const loadingInstance = ElLoading.service(_options)
    try {
        await handleGetTechnology()
        newWaterFall()
        window.addEventListener('resize', throttle(() => { newWaterFall() }, 1000))
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
                    <el-image :src="item.icon" alt="图标" class="icon" fit="cover" lazy
                        v-loading="item.loading[EWaterFallPhotoType.icon]"
                        @load="onImageLoad(item, EWaterFallPhotoType.icon)"></el-image>
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

    @media screen and (max-width:@screen-middle-mobile) {
        .standardBoxChange;
    }

    .mainSection {
        .innerShadow;
        .standardWidth;
        padding: 10px;
        min-width: 180px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        background-color: var(--moment-right-background-color);
        color: var(--moment-right-text-color);

        @media screen and (max-width:@screen-middle-mobile) {
            width: 100%;
            min-height: 1000px;
            margin-left: 0px;
        }

        h2 {
            margin-top: 20px;
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
                transform: scale(1.0);
                transition: all 0.5s ease;
                border-radius: 5px;
                overflow: hidden;

                &:hover {
                    cursor: pointer;
                    transform: scale(1.1);
                    z-index: 1;
                    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3),
                        -4px -4px 12px rgba(0, 0, 0, 0.2);
                }

                .background {
                    .size(100%, 100%);
                    position: absolute;
                    z-index: -1;
                }

                .shade {
                    .size(100%, 100%);
                    position: absolute;
                    z-index: -1;
                    background-color: rgba(0, 0, 0, 0.4);
                }

                span {
                    color: white;
                }

                .icon {
                    .size(50px, 50px);
                }
            }
        }
    }
}
</style>