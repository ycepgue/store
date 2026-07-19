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
import { Pencil, Trash2, Plus, Search } from '@lucide/vue'
import { errorMessage } from '@/libs/utils'
import { useToast } from '@/libs/use-toast'
import type { Category } from '@/pages/categories/models'
import type { CategoryDto } from '@/pages/categories/dto'
import CategoryFormDialog from './components/CategoryFormDialog.vue'
import {
  useCategoriesQuery,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './features'

const { data: categories, isLoading, isError } = useCategoriesQuery()
const createMutation = useCreateCategory()
const updateMutation = useUpdateCategory()
const deleteMutation = useDeleteCategory()
const toast = useToast()

const open = ref(false)
const editing = ref<Category | null>(null)
// Меняем ключ на каждое открытие → диалог ремаунтится и переинициализирует форму (без watch).
const formKey = ref(0)
const saving = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value,
)

// --- Фильтрация и сортировка ---
const search = ref('')
const sort = ref('name')

const visibleCategories = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = (categories.value ?? []).filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q),
  )
  return [...list].sort((a, b) =>
    sort.value === 'name'
      ? a.name.localeCompare(b.name, 'ru')
      : b.createdAt.localeCompare(a.createdAt),
  )
})

function openCreate() {
  editing.value = null
  formKey.value++
  open.value = true
}

function openEdit(category: Category) {
  editing.value = category
  formKey.value++
  open.value = true
}

function handleSubmit(payload: CategoryDto) {
  if (editing.value) {
    updateMutation.mutate(
      { id: editing.value.id, payload },
      {
        onSuccess: () => {
          toast.success('Категория обновлена', payload.name)
          open.value = false
        },
        onError: (e) => toast.error('Не удалось сохранить', errorMessage(e)),
      },
    )
  } else {
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Категория создана', payload.name)
        open.value = false
      },
      onError: (e) => toast.error('Не удалось сохранить', errorMessage(e)),
    })
  }
}

function remove(category: Category) {
  if (!confirm(`Удалить категорию «${category.name}»?`)) return
  deleteMutation.mutate(category.id, {
    onSuccess: () => toast.success('Категория удалена', category.name),
    onError: (e) =>
      toast.error(
        'Не удалось удалить',
        errorMessage(e, 'Возможно, в категории есть товары.'),
      ),
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold tracking-tight">Категории</h1>
      <Button @click="openCreate">
        <Plus class="size-4" /> Добавить
      </Button>
    </div>

    <p v-if="isLoading" class="text-sm text-muted-foreground">Загрузка…</p>
    <p v-else-if="isError" class="text-sm text-destructive">
      Не удалось загрузить категории.
    </p>

    <template v-else>
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative min-w-0 flex-1">
          <Search class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input v-model="search" placeholder="Поиск по названию или slug…" class="pl-8" />
        </div>
        <Select v-model="sort">
          <SelectTrigger class="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">По названию (А-Я)</SelectItem>
            <SelectItem value="newest">Сначала новые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <div
          v-for="c in visibleCategories"
          :key="c.id"
          class="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-2.5"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span class="text-xl">{{ c.icon }}</span>
            <div class="min-w-0">
              <p class="truncate font-medium">{{ c.name }}</p>
              <p class="truncate text-xs text-muted-foreground">/{{ c.slug }}</p>
            </div>
          </div>
          <div class="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon" title="Редактировать" @click="openEdit(c)">
              <Pencil class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Удалить" @click="remove(c)">
              <Trash2 class="size-4 text-destructive" />
            </Button>
          </div>
        </div>
        <p v-if="visibleCategories.length === 0" class="text-sm text-muted-foreground">
          {{ search ? 'Ничего не найдено.' : 'Категорий пока нет.' }}
        </p>
      </div>
    </template>

    <CategoryFormDialog
      :key="formKey"
      v-model:open="open"
      :category="editing"
      :saving="saving"
      @submit="handleSubmit"
    />
  </div>
</template>
