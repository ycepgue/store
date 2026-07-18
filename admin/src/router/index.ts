import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/components/layout/AppShell.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/pages/Dashboard.vue'),
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/pages/Products.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/pages/Categories.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/pages/Orders.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const { isAdmin } = useAuth()

  if (!to.meta.public && !isAdmin.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && isAdmin.value) {
    return { name: 'dashboard' }
  }
})

export default router
