import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { CIcon } from '@coreui/icons-vue'
import * as icons from '@coreui/icons'
import router from './router'

const app = createApp(App)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.use(router)
app.mount('#app')