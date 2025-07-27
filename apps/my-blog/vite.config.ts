import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 大文件可以单独分块
          vendor: ['vue', 'pinia', 'vue-router', 'axios', 'pinia-plugin-persistedstate'],
          utils: ['dayjs', 'lodash', 'marked'],
          element: ['element-plus'],
          types: ['highlight.js'],
        },
      },
    },
    // 启用 Tree Shaking
    minify: 'esbuild',
  },
  envPrefix: 'VUE_APP_',
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/styles/global.less";`, // 引入全局 Less 文件
      },
    },
  },
})
