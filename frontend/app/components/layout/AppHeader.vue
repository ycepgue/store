<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Sun, Moon, User, Package, LogOut, Menu } from '@lucide/vue'
import { CartPopover } from '@/components/cart'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet'

const route = useRoute()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const { isAuthenticated, user, logout } = useAuth()

async function onLogout() {
  logout()
  await navigateTo('/')
}

const navLinks = [
  { label: 'Главная', path: '/' },
  { label: 'Каталог', path: '/products' },
  { label: 'Категории', path: '/categories' },
]

// Mobile navigation drawer. Close it whenever the route changes so tapping a
// link doesn't leave the drawer hanging open over the new page.
const isMenuOpen = ref(false)
watch(() => route.fullPath, () => { isMenuOpen.value = false })
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
      <div class="flex items-center gap-3 sm:gap-6">
        <Sheet v-model:open="isMenuOpen">
          <SheetTrigger as-child>
            <button
              class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted sm:hidden"
              title="Меню"
            >
              <Menu class="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" class="w-64 gap-6">
            <SheetTitle class="text-lg font-bold tracking-tight">
              STORE
            </SheetTitle>
            <SheetDescription class="sr-only">
              Навигация по разделам магазина
            </SheetDescription>
            <nav class="flex flex-col gap-1">
              <SheetClose
                v-for="link in navLinks"
                :key="link.path"
                as-child
              >
                <NuxtLink
                  :to="link.path"
                  class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  :class="route.path === link.path ? 'bg-muted' : 'text-muted-foreground'"
                >
                  {{ link.label }}
                </NuxtLink>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
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
          <template v-if="isAuthenticated">
            <NuxtLink
              to="/orders"
              class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
              :class="route.path === '/orders' ? 'bg-muted' : ''"
              :title="user?.name || user?.email || 'Мои заказы'"
            >
              <Package class="size-4" />
            </NuxtLink>
            <button
              class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
              title="Выйти"
              @click="onLogout"
            >
              <LogOut class="size-4" />
            </button>
          </template>
          <NuxtLink
            v-else
            to="/login"
            class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
            title="Войти"
          >
            <User class="size-4" />
          </NuxtLink>
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
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
