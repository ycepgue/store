<script setup lang="ts">
import { computed } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, ArrowUp, ArrowDown, ChevronsUpDown } from '@lucide/vue'
import { formatPrice } from '@/libs/utils'
import type { Category, Product } from '@/pages/products/models'

export type ProductSortKey = 'name' | 'price' | 'stock'

const props = defineProps<{
  products: Product[]
  categories: Category[]
  sortKey: ProductSortKey
  sortDir: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  sort: [key: ProductSortKey]
  edit: [product: Product]
  remove: [product: Product]
}>()

const categoryName = (id: number) =>
  props.categories.find((c) => c.id === id)?.name ?? '—'

const columns = computed<{ key: ProductSortKey; label: string; numeric?: boolean }[]>(() => [
  { key: 'name', label: 'Товар' },
  { key: 'price', label: 'Цена', numeric: true },
  { key: 'stock', label: 'Ост.', numeric: true },
])
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-for="col in columns" :key="col.key">
            <button
              type="button"
              class="inline-flex items-center gap-1 font-medium transition-colors hover:text-foreground"
              @click="emit('sort', col.key)"
            >
              {{ col.label }}
              <ArrowUp v-if="sortKey === col.key && sortDir === 'asc'" class="size-3.5" />
              <ArrowDown v-else-if="sortKey === col.key && sortDir === 'desc'" class="size-3.5" />
              <ChevronsUpDown v-else class="size-3.5 opacity-40" />
            </button>
          </TableHead>
          <TableHead>Категория</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="p in products" :key="p.id">
          <TableCell class="font-medium">{{ p.name }}</TableCell>
          <TableCell class="whitespace-nowrap tabular-nums">{{ formatPrice(p.price) }}</TableCell>
          <TableCell class="tabular-nums">{{ p.stock }}</TableCell>
          <TableCell class="text-sm text-muted-foreground">{{ categoryName(p.categoryId) }}</TableCell>
          <TableCell>
            <div class="flex justify-end gap-1">
              <Button variant="ghost" size="icon" title="Редактировать" @click="emit('edit', p)">
                <Pencil class="size-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Удалить" @click="emit('remove', p)">
                <Trash2 class="size-4 text-destructive" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow v-if="products.length === 0">
          <TableCell colspan="5" class="py-6 text-center text-sm text-muted-foreground">
            Ничего не найдено.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
