<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search } from '@lucide/vue'
import { errorMessage } from '@/libs/utils'
import { useToast } from '@/libs/use-toast'
import type { Product } from '@/pages/products/models'
import type { ProductDto } from '@/pages/products/dto'
import ProductsTable, { type ProductSortKey } from './components/ProductsTable.vue'
import ProductFormDialog from './components/ProductFormDialog.vue'
import {
  useProductsQuery,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from './features'
import { useCategoriesQuery } from '@/pages/categories/features'

const { data: products, isLoading, isError } = useProductsQuery()
const { data: categories } = useCategoriesQuery()
const createMutation = useCreateProduct()
const updateMutation = useUpdateProduct()
const deleteMutation = useDeleteProduct()
const toast = useToast()

const open = ref(false)
const editing = ref<Product | null>(null)
// Меняем ключ на каждое открытие → диалог ремаунтится и переинициализирует форму (без watch).
const formKey = ref(0)
const saving = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value,
)

// --- Фильтрация и сортировка ---
const search = ref('')
const categoryFilter = ref('all')
const sortKey = ref<ProductSortKey>('name')
const sortDir = ref<'asc' | 'desc'>('asc')

function toggleSort(key: ProductSortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

const visibleProducts = computed(() => {
  const q = search.value.trim().toLowerCase()
  const catId = categoryFilter.value === 'all' ? null : Number(categoryFilter.value)
  const list = (products.value ?? []).filter((p) => {
    const matchesText =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    const matchesCat = catId === null || p.categoryId === catId
    return matchesText && matchesCat
  })

  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...list].sort((a, b) => {
    if (sortKey.value === 'name') return a.name.localeCompare(b.name, 'ru') * dir
    return (a[sortKey.value] - b[sortKey.value]) * dir
  })
})

function openCreate() {
  editing.value = null
  formKey.value++
  open.value = true
}

function openEdit(product: Product) {
  editing.value = product
  formKey.value++
  open.value = true
}

function handleSubmit(payload: ProductDto) {
  if (editing.value) {
    updateMutation.mutate(
      { id: editing.value.id, payload },
      {
        onSuccess: () => {
          toast.success('Товар обновлён', payload.name)
          open.value = false
        },
        onError: (e) => toast.error('Не удалось сохранить', errorMessage(e)),
      },
    )
  } else {
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Товар создан', payload.name)
        open.value = false
      },
      onError: (e) => toast.error('Не удалось сохранить', errorMessage(e)),
    })
  }
}

function remove(product: Product) {
  if (!confirm(`Удалить товар «${product.name}»?`)) return
  deleteMutation.mutate(product.id, {
    onSuccess: () => toast.success('Товар удалён', product.name),
    onError: (e) => toast.error('Не удалось удалить', errorMessage(e)),
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold tracking-tight">Товары</h1>
      <Button @click="openCreate">
        <Plus class="size-4" /> Добавить
      </Button>
    </div>

    <p v-if="isLoading" class="text-sm text-muted-foreground">Загрузка…</p>
    <p v-else-if="isError" class="text-sm text-destructive">
      Не удалось загрузить товары.
    </p>

    <template v-else>
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative min-w-0 flex-1">
          <Search class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input v-model="search" placeholder="Поиск по названию или slug…" class="pl-8" />
        </div>
        <Select v-model="categoryFilter">
          <SelectTrigger class="w-52">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem v-for="c in categories" :key="c.id" :value="String(c.id)">
              {{ c.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProductsTable
        :products="visibleProducts"
        :categories="categories ?? []"
        :sort-key="sortKey"
        :sort-dir="sortDir"
        @sort="toggleSort"
        @edit="openEdit"
        @remove="remove"
      />
    </template>

    <ProductFormDialog
      :key="formKey"
      v-model:open="open"
      :product="editing"
      :categories="categories ?? []"
      :saving="saving"
      @submit="handleSubmit"
    />
  </div>
</template>
