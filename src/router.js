import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ProductDetail from './components/ProductDetail.vue'

const routes = [
  { path: '/', component: App },
  { path: '/produkty/:id', component: ProductDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

