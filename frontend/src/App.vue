<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables'
import { CartDrawer } from '@/components/cart'
import { ShoppingCart } from '@lucide/vue'
import {
  PopoverRoot as Popover,
  PopoverTrigger,
  PopoverContent,
} from 'reka-ui'
const router = useRouter()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const { totalItems } = useCart()

const navLinks = [
  { label: 'Главная', path: '/' },
  { label: 'Каталог', path: '/products' },
  { label: 'Категории', path: '/categories' },
]
</script>

<template>
  <div class="min-h-dvh bg-background text-foreground">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div class="flex items-center gap-6">
          <router-link
            to="/"
            class="text-lg font-bold tracking-tight"
          >
            STORE
          </router-link>
          <nav class="hidden items-center gap-1 sm:flex">
            <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              :class="router.currentRoute.value.path === link.path ? 'bg-muted' : 'text-muted-foreground'"
            >
              {{ link.label }}
            </router-link>
          </nav>
        </div>
        <div class="flex items-center gap-2">
          <Popover>
            <PopoverTrigger as-child>
              <button
                class="relative inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
                title="Корзина"
              >
                <ShoppingCart class="size-4" />
                <span
                  v-if="totalItems > 0"
                  class="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {{ totalItems > 99 ? '99+' : totalItems }}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" :side-offset="8" class="bg-transparent border-none shadow-none p-0">
              <CartDrawer />
            </PopoverContent>
          </Popover>
          <button
            class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
            @click="toggleDark()"
            :title="isDark ? 'Светлая тема' : 'Тёмная тема'"
          >
            <span v-if="isDark" class="text-lg">☀️</span>
            <span v-else class="text-lg">🌙</span>
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6">
      <router-view />
    </main>
  </div>
</template>
