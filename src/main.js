import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { CIcon } from '@coreui/icons-vue'
import * as icons from '@coreui/icons'

const app = createApp(App)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.mount('#app')