<script setup lang="ts">
const props = defineProps<{
    article_url?: string;
}>();
</script>

<template>
    <div class="feishu-article-item-box">
        <div ref="articleBody" class="markdown-body" v-if="props.article_url">
            <iframe :src="props.article_url"></iframe>
        </div>
    </div>
</template>

<style lang="less" scoped>
@screen-small-mobile: 750px;
@screen-middle-mobile: 960px;

.feishu-article-item-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    .markdown-body {
        flex: 1;
        overflow-y: auto;
        position: relative;
        padding: 10px;

        @media screen and (max-width:@screen-middle-mobile) {
            padding: 0px;
        }

        iframe {
            width: 100%;
            height: 100%;
            border: 1px solid #f7f7f7;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1),
                0 2px 8px rgba(0, 0, 0, 0.06);
        }
    }
}
</style>