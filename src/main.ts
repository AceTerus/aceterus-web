import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import piniaPersist from 'pinia-plugin-persist'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'

import './assets/iconfont/iconfont.css'
import Iconfont from './components/Iconfont.vue'

import en from "./locales/en.json";
import ms from "./locales/ms.json";
import zh from "./locales/zh.json";

const i18n = createI18n({
    locale: 'en',
    messages: { en, ms, zh },
  // something vue-i18n options here ...
})

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)
app.use(router)
app.use(i18n);
app.use(ElementPlus, { locale: zhCn })
app.component('Iconfont', Iconfont)
app.mount('#app')
