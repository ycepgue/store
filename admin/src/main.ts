import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import { AUTH_EXPIRED_EVENT } from '@/api/client'
import { useAuth } from '@/pages/auth'
import './assets/index.css'

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: false },
    },
  },
})

// Протухший токен: чистим сессию и уводим на логин.
window.addEventListener(AUTH_EXPIRED_EVENT, () => {
  useAuth().logout()
  if (router.currentRoute.value.name !== 'login') {
    router.push({ name: 'login' })
  }
})

app.mount('#app')
