import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 引入 Element Plus 样式
import persist from 'pinia-plugin-persistedstate'
const app = createApp(App)
// 全局注册 Element Plus
app.use(ElementPlus)
app.use(createPinia().use(persist))
app.use(router)

app.mount('#app')
