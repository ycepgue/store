<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { computed } from 'vue'
import { firstImage } from '@/lib/utils'
import { AppFooter } from '@/components/layout'

const router = useRouter()
const { data: categoriesData } = useCategories()
const { data: productsData } = useProducts(
  computed(() => ({ limit: 4, sortBy: 'createdAt' as const, sortOrder: 'desc' as const })),
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
        v-if="categories.length"
        class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card
          v-for="cat in categories"
          :key="cat.id"
          class="cursor-pointer transition-colors hover:bg-muted/50"
          @click="router.push('/products')"
        >
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">
              {{ cat.name }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{{ cat.slug }}</CardDescription>
          </CardContent>
        </Card>
      </div>
      <div v-else class="py-8 text-center text-muted-foreground">
        Загрузка категорий...
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
        v-if="featured.length"
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
        Загрузка товаров...
      </div>
    </section>

    <AppFooter />
  </div>
</template>
