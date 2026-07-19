<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Package, Tags, ClipboardList } from '@lucide/vue'
import { formatPrice } from '@/libs/utils'
import { useProductsQuery } from '@/pages/products/features'
import { useCategoriesQuery } from '@/pages/categories/features'
import { useOrdersQuery } from '@/pages/orders/features'

const products = useProductsQuery()
const categories = useCategoriesQuery()
const orders = useOrdersQuery()

const revenue = computed(() =>
  (orders.data.value ?? [])
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0),
)

const stats = computed(() => [
  { label: 'Товары', value: products.data.value?.length ?? '—', to: '/products', icon: Package },
  { label: 'Категории', value: categories.data.value?.length ?? '—', to: '/categories', icon: Tags },
  { label: 'Заказы', value: orders.data.value?.length ?? '—', to: '/orders', icon: ClipboardList },
])
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold tracking-tight">Обзор</h1>

    <div class="grid gap-4 sm:grid-cols-3">
      <RouterLink v-for="s in stats" :key="s.to" :to="s.to">
        <Card class="transition-colors hover:ring-primary/40">
          <CardContent class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">{{ s.label }}</p>
              <p class="mt-1 text-2xl font-bold tabular-nums">{{ s.value }}</p>
            </div>
            <component :is="s.icon" class="size-6 text-primary" />
          </CardContent>
        </Card>
      </RouterLink>
    </div>

    <Card>
      <CardContent>
        <p class="text-sm text-muted-foreground">Выручка (без отменённых заказов)</p>
        <p class="mt-1 text-2xl font-bold tabular-nums">{{ formatPrice(revenue) }}</p>
      </CardContent>
    </Card>
  </div>
</template>
