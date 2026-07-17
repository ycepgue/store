<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Sun, Moon } from '@lucide/vue'
import { CartPopover } from '@/components/cart'

const route = useRoute()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const navLinks = [
  { label: 'Главная', path: '/' },
  { label: 'Каталог', path: '/products' },
  { label: 'Категории', path: '/categories' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
      <div class="flex items-center gap-6">
        <NuxtLink
          to="/"
          class="text-lg font-bold tracking-tight"
        >
          STORE
        </NuxtLink>
        <nav class="hidden items-center gap-1 sm:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            :class="route.path === link.path ? 'bg-muted' : 'text-muted-foreground'"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
      <div class="flex items-center gap-2">
        <CartPopover />
        <ClientOnly>
          <button
            class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
            @click="toggleDark()"
            :title="isDark ? 'Светлая тема' : 'Тёмная тема'"
          >
            <Sun v-if="isDark" class="size-4 text-cyan-500" />
            <Moon v-else class="size-4 text-cyan-500" />
          </button>
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
