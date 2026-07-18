<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Pencil, Trash2, Plus } from '@lucide/vue'
import {
  useProductsQuery,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/queries/products'
import { useCategoriesQuery } from '@/queries/categories'
import { ApiError } from '@/api/client'
import type { Product } from '@/types'

const { data: products, isLoading, isError } = useProductsQuery()
const { data: categories } = useCategoriesQuery()
const createMutation = useCreateProduct()
const updateMutation = useUpdateProduct()
const deleteMutation = useDeleteProduct()

const open = ref(false)
const editingId = ref<number | null>(null)
const errorMsg = ref('')
const saving = ref(false)

const blank = () => ({
  name: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: 0,
  images: '',
})
const form = reactive(blank())

const priceFormat = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
const categoryName = (id: number) =>
  categories.value?.find((c) => c.id === id)?.name ?? '—'

function openCreate() {
  editingId.value = null
  Object.assign(form, blank())
  if (categories.value?.length) form.categoryId = categories.value[0].id
  errorMsg.value = ''
  open.value = true
}

function openEdit(p: Product) {
  editingId.value = p.id
  form.name = p.name
  form.slug = p.slug
  form.description = p.description ?? ''
  form.price = p.price
  form.stock = p.stock
  form.categoryId = p.categoryId
  form.images = p.images.join(', ')
  errorMsg.value = ''
  open.value = true
}

async function submit() {
  errorMsg.value = ''
  if (!form.name.trim() || !form.slug.trim()) {
    errorMsg.value = 'Название и slug обязательны.'
    return
  }
  if (!form.categoryId) {
    errorMsg.value = 'Выберите категорию.'
    return
  }
  saving.value = true
  try {
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
      images: form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }
    if (editingId.value) {
      await updateMutation.mutateAsync({ id: editingId.value, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    open.value = false
  } catch (e) {
    errorMsg.value =
      e instanceof ApiError ? e.message : 'Не удалось сохранить товар.'
  } finally {
    saving.value = false
  }
}

async function remove(p: Product) {
  if (!confirm(`Удалить товар «${p.name}»?`)) return
  try {
    await deleteMutation.mutateAsync(p.id)
  } catch (e) {
    alert(e instanceof ApiError ? e.message : 'Не удалось удалить товар.')
  }
}

// Предвыбор первой категории при открытии формы создания.
watch(
  () => categories.value,
  (list) => {
    if (open.value && !editingId.value && !form.categoryId && list?.length) {
      form.categoryId = list[0].id
    }
  },
)
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

    <div v-else class="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Товар</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Ост.</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="p in products" :key="p.id">
            <TableCell class="font-medium">{{ p.name }}</TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ categoryName(p.categoryId) }}</TableCell>
            <TableCell class="whitespace-nowrap tabular-nums">{{ priceFormat(p.price) }}</TableCell>
            <TableCell class="tabular-nums">{{ p.stock }}</TableCell>
            <TableCell>
              <div class="flex justify-end gap-1">
                <Button variant="ghost" size="icon" title="Редактировать" @click="openEdit(p)">
                  <Pencil class="size-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Удалить" @click="remove(p)">
                  <Trash2 class="size-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Модалка создания/редактирования -->
    <Dialog v-model:open="open">
      <DialogContent class="max-w-lg">
        <DialogTitle>{{ editingId ? `Редактировать №${editingId}` : 'Новый товар' }}</DialogTitle>
        <DialogDescription>Заполните карточку товара.</DialogDescription>

        <form class="space-y-3" @submit.prevent="submit">
          <div class="space-y-1.5">
            <label class="text-sm text-muted-foreground">Название</label>
            <Input v-model="form.name" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm text-muted-foreground">Slug</label>
            <Input v-model="form.slug" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-sm text-muted-foreground">Цена, ₽</label>
              <Input v-model="form.price" type="number" min="0" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm text-muted-foreground">Остаток</label>
              <Input v-model="form.stock" type="number" min="0" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm text-muted-foreground">Категория</label>
            <NativeSelect v-model="form.categoryId" class="w-full">
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </NativeSelect>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm text-muted-foreground">Изображения (URL через запятую)</label>
            <Input v-model="form.images" placeholder="https://…/a.jpg, https://…/b.jpg" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm text-muted-foreground">Описание</label>
            <Input v-model="form.description" />
          </div>

          <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>

          <div class="flex justify-end gap-2 pt-1">
            <DialogClose as-child>
              <Button type="button" variant="outline">Отмена</Button>
            </DialogClose>
            <Button type="submit" :disabled="saving">
              {{ saving ? 'Сохранение…' : 'Сохранить' }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
