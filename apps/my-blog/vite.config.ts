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
    outDir: 'dist-my-blog', // 修改输出目录名字
    emptyOutDir: true, // 打包前清空输出目录，避免文件残留
    rollupOptions: {
      output: {
        manualChunks: {
          // 大文件可以单独分块
          vendor: ['vue', 'pinia', 'vue-router', 'axios', 'pinia-plugin-persistedstate'],
          utils: ['dayjs', 'lodash'],
          element: ['element-plus'],
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
