import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css' // 引入 Element Plus 样式
import '@/styles/theme.css'
import persist from 'pinia-plugin-persistedstate'
const app = createApp(App)

app.use(createPinia().use(persist))
app.use(router)

app.mount('#app')
