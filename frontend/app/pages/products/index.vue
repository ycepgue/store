<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { firstImage } from '@/lib/utils'

const route = useRoute()
const router = useRouter()

const { addItem } = useCart()

// All filters are initialised from the URL so the listing is server-rendered
// and the current view is shareable / restorable on reload.
const firstQueryValue = (v: unknown) => (Array.isArray(v) ? v[0] : v)

const searchInput = ref(String(firstQueryValue(route.query.search) ?? ''))
// Debounce the value that drives fetching + the URL so typing doesn't spam the
// backend or the history.
const debouncedSearch = refDebounced(searchInput, 350)

const categoryIdRaw = Number(firstQueryValue(route.query.categoryId))
const selectedCategoryId = ref<number | null>(
  Number.isFinite(categoryIdRaw) && categoryIdRaw > 0 ? categoryIdRaw : null,
)

const pageRaw = Number(firstQueryValue(route.query.page))
const page = ref(Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1)

const limit = 12

// Changing a filter resets pagination to the first page.
watch([debouncedSearch, selectedCategoryId], () => {
  page.value = 1
})

// Reflect the current state in the URL. Non-immediate, so it runs only on the
// client and never rewrites the URL on initial load. `replace` keeps filter
// changes out of the browser history.
watch([debouncedSearch, selectedCategoryId, page], () => {
  const q: Record<string, string> = {}
  if (selectedCategoryId.value) q.categoryId = String(selectedCategoryId.value)
  if (debouncedSearch.value) q.search = debouncedSearch.value
  if (page.value > 1) q.page = String(page.value)
  router.replace({ query: q })
})

const query = computed(() => ({
  categoryId: selectedCategoryId.value ?? undefined,
  search: debouncedSearch.value || undefined,
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

const currentCategory = computed(() =>
  categories.value.find(c => c.id === selectedCategoryId.value),
)

useSeoMeta({
  title: () => {
    if (debouncedSearch.value) return `Поиск: ${debouncedSearch.value} — Store`
    if (currentCategory.value) return `${currentCategory.value.name} — Store`
    return 'Каталог товаров — Store'
  },
  description: 'Полный каталог товаров: электроника, аксессуары и многое другое.',
})

const priceFormat = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

function selectCategory(id: number | null) {
  selectedCategoryId.value = id
}

function resetFilters() {
  searchInput.value = ''
  selectedCategoryId.value = null
}
</script>

<template>
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
          v-model="searchInput"
          placeholder="Поиск по названию..."
        />
      </div>
    </div>

    <Separator />

    <div
      v-if="isLoading"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <Card v-for="i in limit" :key="i" class="overflow-hidden">
        <Skeleton class="aspect-square w-full rounded-none" />
        <CardHeader class="pb-2">
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="mt-2 h-3 w-1/2" />
        </CardHeader>
        <CardContent class="flex items-center justify-between">
          <Skeleton class="h-6 w-20" />
          <Skeleton class="h-8 w-24" />
        </CardContent>
      </Card>
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
      <Button variant="outline" size="sm" @click="resetFilters()">
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
