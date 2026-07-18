<script setup lang="ts">
import { RouterView } from 'vue-router'
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Sun,
  Moon,
  LogOut,
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/pages/auth'
import { useTheme } from '@/libs/use-theme'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const { isDark, toggle } = useTheme()
const router = useRouter()

const links = [
  { label: 'Обзор', to: '/', icon: LayoutDashboard },
  { label: 'Товары', to: '/products', icon: Package },
  { label: 'Категории', to: '/categories', icon: Tags },
  { label: 'Заказы', to: '/orders', icon: ClipboardList },
]

function onLogout() {
  logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="flex min-h-screen bg-background text-foreground">
    <!-- Сайдбар -->
    <aside class="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar p-4 sm:flex">
      <div class="mb-6 px-2">
        <p class="text-lg font-bold tracking-tight">STORE</p>
        <p class="text-xs text-muted-foreground">Админ-панель</p>
      </div>
      <nav class="flex flex-col gap-1">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          active-class="bg-muted text-foreground"
          :exact-active-class="link.to === '/' ? 'bg-muted text-foreground' : ''"
        >
          <component :is="link.icon" class="size-4" />
          {{ link.label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Топбар -->
      <header class="flex h-14 items-center justify-between border-b border-border px-4 sm:px-6">
        <!-- Мобильная навигация -->
        <nav class="flex gap-1 sm:hidden">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
            active-class="bg-muted text-foreground"
          >
            <component :is="link.icon" class="size-4" />
          </RouterLink>
        </nav>
        <div class="hidden text-sm text-muted-foreground sm:block">
          {{ user?.name || user?.email }}
        </div>

        <div class="flex items-center gap-2">
          <Button variant="ghost" size="icon" :title="isDark ? 'Светлая тема' : 'Тёмная тема'" @click="toggle">
            <Sun v-if="isDark" class="size-4" />
            <Moon v-else class="size-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Выйти" @click="onLogout">
            <LogOut class="size-4" />
          </Button>
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
