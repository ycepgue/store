<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories } from '@/composables'
import { Button } from '@/components/ui/button'
import { ArrowRight } from '@lucide/vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const router = useRouter()
const { data: categoriesData, isLoading } = useCategories()
const categories = computed(() => categoriesData.value ?? [])

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
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Категории</h1>
      <p class="mt-1 text-muted-foreground">
        Выберите категорию для поиска товаров
      </p>
    </div>

    <div
      v-if="isLoading"
      class="flex items-center justify-center py-16 text-muted-foreground"
    >
      Загрузка...
    </div>

    <div
      v-else-if="categories.length > 0"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <Card
        v-for="cat in categories"
        :key="cat.id"
        class="flex flex-col cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
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

    <div
      v-else
      class="flex flex-col items-center gap-2 py-16 text-center"
    >
      <p class="text-lg font-medium">Категории не найдены</p>
    </div>
  </div>
</template>
