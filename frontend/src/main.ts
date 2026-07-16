import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

import './assets/index.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin)
app.mount('#app')
