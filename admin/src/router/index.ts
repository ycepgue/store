import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/pages/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/Login.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/components/layout/AppShell.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/pages/dashboard/Dashboard.vue'),
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/pages/products/Products.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/pages/categories/Categories.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/pages/orders/Orders.vue'),
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
