<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import type { Category, Product } from '@/pages/products/models'
import type { ProductDto } from '@/pages/products/dto'

const props = defineProps<{
  open: boolean
  product: Product | null
  categories: Category[]
  saving: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [payload: ProductDto]
}>()

// Инициализация один раз при монтировании; родитель ремаунтит диалог по :key
// на каждое открытие — поэтому watch на props.open не нужен (images массив → строка).
const form = reactive({
  name: props.product?.name ?? '',
  slug: props.product?.slug ?? '',
  description: props.product?.description ?? '',
  price: props.product?.price ?? 0,
  stock: props.product?.stock ?? 0,
  categoryId: props.product?.categoryId ?? props.categories[0]?.id ?? 0,
  images: props.product?.images.join(', ') ?? '',
})
const errorMsg = ref('')

// Кастомный Select работает со строками — проксируем categoryId через computed, без watch.
const categoryModel = computed({
  get: () => (form.categoryId ? String(form.categoryId) : ''),
  set: (v: string) => {
    form.categoryId = Number(v)
  },
})

function submit() {
  errorMsg.value = ''
  if (!form.name.trim() || !form.slug.trim()) {
    errorMsg.value = 'Название и slug обязательны.'
    return
  }
  if (!form.categoryId) {
    errorMsg.value = 'Выберите категорию.'
    return
  }
  emit('submit', {
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
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-lg">
      <DialogTitle>{{ product ? `Редактировать №${product.id}` : 'Новый товар' }}</DialogTitle>
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
          <Select v-model="categoryModel">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="c in categories" :key="c.id" :value="String(c.id)">
                {{ c.name }}
              </SelectItem>
            </SelectContent>
          </Select>
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
</template>
