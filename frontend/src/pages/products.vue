<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategories, useProducts } from '@/composables'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/composables'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { firstImage } from '@/lib/utils'

const route = useRoute()
const router = useRouter()

const { addItem } = useCart()

const search = ref('')
const selectedCategoryId = ref<number | null>(
  route.query.categoryId ? Number(route.query.categoryId) : null,
)
const page = ref(1)
const limit = 12

watch(selectedCategoryId, (id) => {
  router.replace({ query: id ? { categoryId: id } : {} })
})

const query = computed(() => ({
  categoryId: selectedCategoryId.value ?? undefined,
  search: search.value || undefined,
  page: page.value,
  limit,
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
}))

const { data: productsData, isLoading } = useProducts(query)
const { data: categoriesData } = useCategories()

const products = computed(() => productsData.value?.items ?? [])
const total = computed(() => productsData.value?.total ?? 0)
const totalPages = computed(() => productsData.value?.totalPages ?? 0)
const categories = computed(() => categoriesData.value ?? [])

const priceFormat = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

function selectCategory(id: number | null) {
  selectedCategoryId.value = id
  page.value = 1
}

function onSearch() {
  page.value = 1
}
</script>

<template>
  <!-- Product detail (child route) -->
  <router-view />

  <!-- Product list (only when no child route matched, i.e. /products) -->
  <template v-if="!route.params.id">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Каталог товаров</h1>
          <p class="mt-1 text-muted-foreground">
            {{ total }} товаров
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap gap-2">
          <Button
            :variant="selectedCategoryId === null ? 'default' : 'outline'"
            size="sm"
            @click="selectCategory(null)"
          >
            Все
          </Button>
          <Button
            v-for="cat in categories"
            :key="cat.id"
            :variant="selectedCategoryId === cat.id ? 'default' : 'outline'"
            size="sm"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }}
          </Button>
        </div>
        <div class="w-full sm:w-64">
          <Input
            v-model="search"
            placeholder="Поиск по названию..."
            @keyup.enter="onSearch"
          />
        </div>
      </div>

      <Separator />

      <div
        v-if="isLoading"
        class="flex items-center justify-center py-16 text-muted-foreground"
      >
        Загрузка...
      </div>

      <div
        v-else-if="products.length > 0"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <Card
          v-for="p in products"
          :key="p.id"
          class="cursor-pointer overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
          @click="router.push(`/products/${p.id}`)"
        >
          <div class="aspect-square overflow-hidden bg-muted/20">
            <img
              v-if="p.images.length"
              :src="firstImage(p.images)"
              :alt="p.name"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div v-else class="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground/20">
              {{ p.name.charAt(0) }}
            </div>
          </div>
          <CardHeader class="pb-2">
            <div class="flex items-start justify-between gap-2">
              <div>
                <CardTitle class="text-sm font-medium leading-tight">
                  {{ p.name }}
                </CardTitle>
                <CardDescription class="mt-0.5 text-xs">
                  {{ p.category?.name ?? '—' }}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                class="shrink-0 text-xs"
                :class="p.stock < 10 ? 'text-destructive border-destructive/30' : ''"
              >
                {{ p.stock < 10 ? 'Мало' : 'В наличии' }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="flex items-center justify-between">
            <span class="text-lg font-bold">{{ priceFormat(p.price) }}</span>
            <Button size="sm" @click.stop="addItem(p)">В корзину</Button>
          </CardContent>
        </Card>
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-2 py-16 text-center"
      >
        <span class="text-4xl">🔍</span>
        <p class="text-lg font-medium">Ничего не найдено</p>
        <p class="text-sm text-muted-foreground">
          Попробуйте изменить параметры поиска
        </p>
        <Button variant="outline" size="sm" @click="search = ''; selectedCategoryId = null; page = 1">
          Сбросить фильтры
        </Button>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-center gap-2"
      >
        <Button
          variant="outline"
          size="sm"
          :disabled="page <= 1"
          @click="page > 1 && (page -= 1)"
        >
          ← Назад
        </Button>
        <span class="text-sm text-muted-foreground">
          {{ page }} из {{ totalPages }}
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="page >= totalPages"
          @click="page < totalPages && (page += 1)"
        >
          Вперёд →
        </Button>
      </div>
    </div>
  </template>
</template>
