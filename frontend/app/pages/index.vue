<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight } from '@lucide/vue'
import { computed } from 'vue'
import { firstImage } from '@/lib/utils'
import { AppFooter } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

const categoryIcons: Record<string, string> = {
  electronics: '⚡',
  clothing: '👕',
  shoes: '👟',
  accessories: '🎒',
  'home-garden': '🏡',
  sports: '⚽',
  books: '📚',
  toys: '🧩',
}

const router = useRouter()

useSeoMeta({
  title: 'Store — магазин электроники и аксессуаров',
  description: 'Откройте для себя лучшие товары по отличным ценам.',
  ogTitle: 'Store — магазин электроники и аксессуаров',
  ogDescription: 'Откройте для себя лучшие товары по отличным ценам.',
})

const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories()
const { data: productsData, isLoading: isFeaturedLoading } = useProducts(
  computed(() => ({ limit: 4, sortBy: 'createdAt' as const, sortOrder: 'desc' as const })),
  'featured-products',
)

const categories = computed(() => (categoriesData.value ?? []).slice(0, 4))
const featured = computed(() => productsData.value?.items ?? [])

const priceFormat = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
</script>

<template>
  <div class="space-y-16">
    <!-- Hero -->
    <section class="flex flex-col items-center gap-4 pt-12 text-center">
      <h1 class="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Магазин современной<br />
        <span class="text-primary">электроники и аксессуаров</span>
      </h1>
      <p class="max-w-lg text-muted-foreground">
        Откройте для себя лучшие товары по отличным ценам.
      </p>
      <div class="flex gap-3">
        <Button size="lg" @click="router.push('/products')">
          Смотреть каталог
        </Button>
        <Button size="lg" variant="outline" @click="router.push('/categories')">
          Категории
        </Button>
      </div>
    </section>

    <!-- Categories -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Категории</h2>
        <Button variant="ghost" size="sm" @click="router.push('/categories')">
          Все категории →
        </Button>
      </div>
      <div
        v-if="isCategoriesLoading"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card v-for="i in 4" :key="i" class="flex min-h-43 flex-col">
          <CardHeader class="flex flex-row items-center gap-4 pb-2">
            <Skeleton class="size-8 rounded-full" />
            <Skeleton class="h-4 w-24" />
          </CardHeader>
          <CardContent class="flex-1 flex flex-col justify-between gap-3">
            <div class="space-y-2">
              <Skeleton class="h-3 w-full" />
              <Skeleton class="h-3 w-2/3" />
            </div>
            <Skeleton class="mt-3 h-4 w-28" />
          </CardContent>
        </Card>
      </div>
      <div
        v-else-if="categories.length"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card
          v-for="cat in categories"
          :key="cat.id"
          class="flex min-h-43 flex-col cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
          @click="router.push(`/products?categoryId=${cat.id}`)"
        >
          <CardHeader class="flex flex-row items-center gap-4 pb-2">
            <span class="text-3xl">{{ categoryIcons[cat.slug] ?? '📦' }}</span>
            <div>
              <CardTitle class="text-base font-medium">
                {{ cat.name }}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent class="flex-1 flex flex-col justify-between">
            <p class="text-sm text-muted-foreground">
              {{ cat.description ?? 'Нет описания' }}
            </p>
            <div class="mt-3">
              <Button variant="ghost" size="sm" class="px-0 text-xs">
                Смотреть товары <ArrowRight class="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div v-else class="py-8 text-center text-muted-foreground">
        Категории не найдены
      </div>
    </section>

    <!-- Featured -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Новинки</h2>
        <Button variant="ghost" size="sm" @click="router.push('/products')">
          Все товары →
        </Button>
      </div>
      <div
        v-if="isFeaturedLoading"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card v-for="i in 4" :key="i" class="overflow-hidden">
          <Skeleton class="aspect-square w-full rounded-none" />
          <CardHeader class="pb-2">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="mt-2 h-3 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-5 w-16" />
          </CardContent>
        </Card>
      </div>
      <div
        v-else-if="featured.length"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card
          v-for="p in featured"
          :key="p.id"
          class="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
          @click="router.push(`/products/${p.id}`)"
        >
          <div class="aspect-square overflow-hidden bg-muted/30">
            <img
              v-if="p.images.length"
              :src="firstImage(p.images)"
              :alt="p.name"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div v-else class="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground/30">
              {{ p.name.charAt(0) }}
            </div>
          </div>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">{{ p.name }}</CardTitle>
            <CardDescription>{{ p.category?.name ?? '—' }}</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-lg font-bold">{{ priceFormat(p.price) }}</p>
          </CardContent>
        </Card>
      </div>
      <div v-else class="py-8 text-center text-muted-foreground">
        Товары не найдены
      </div>
    </section>

    <AppFooter />
  </div>
</template>
