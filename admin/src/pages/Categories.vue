<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Pencil, Trash2, Plus } from '@lucide/vue'
import {
  useCategoriesQuery,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/queries/categories'
import { ApiError } from '@/api/client'
import type { Category } from '@/types'

const { data: categories, isLoading, isError } = useCategoriesQuery()
const createMutation = useCreateCategory()
const updateMutation = useUpdateCategory()
const deleteMutation = useDeleteCategory()

const open = ref(false)
const editingId = ref<number | null>(null)
const errorMsg = ref('')
const form = reactive({ name: '', slug: '', icon: '', description: '' })

const saving = ref(false)

function openCreate() {
  editingId.value = null
  Object.assign(form, { name: '', slug: '', icon: '', description: '' })
  errorMsg.value = ''
  open.value = true
}

function openEdit(c: Category) {
  editingId.value = c.id
  form.name = c.name
  form.slug = c.slug
  form.icon = c.icon
  form.description = c.description ?? ''
  errorMsg.value = ''
  open.value = true
}

async function submit() {
  errorMsg.value = ''
  if (!form.name.trim() || !form.slug.trim()) {
    errorMsg.value = 'Название и slug обязательны.'
    return
  }
  saving.value = true
  try {
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      icon: form.icon.trim() || undefined,
      description: form.description.trim() || undefined,
    }
    if (editingId.value) {
      await updateMutation.mutateAsync({ id: editingId.value, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    open.value = false
  } catch (e) {
    errorMsg.value =
      e instanceof ApiError ? e.message : 'Не удалось сохранить категорию.'
  } finally {
    saving.value = false
  }
}

async function remove(c: Category) {
  if (!confirm(`Удалить категорию «${c.name}»?`)) return
  try {
    await deleteMutation.mutateAsync(c.id)
  } catch (e) {
    alert(
      e instanceof ApiError
        ? e.message
        : 'Не удалось удалить категорию (возможно, в ней есть товары).',
    )
  }
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

    <div v-else class="space-y-2">
      <div
        v-for="c in categories"
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
      <p v-if="categories && categories.length === 0" class="text-sm text-muted-foreground">
        Категорий пока нет.
      </p>
    </div>

    <!-- Модалка создания/редактирования -->
    <Dialog v-model:open="open">
      <DialogContent>
        <DialogTitle>{{ editingId ? 'Редактировать категорию' : 'Новая категория' }}</DialogTitle>
        <DialogDescription>Категории группируют товары в каталоге.</DialogDescription>

        <form class="space-y-3" @submit.prevent="submit">
          <div class="space-y-1.5">
            <label class="text-sm text-muted-foreground">Название</label>
            <Input v-model="form.name" placeholder="Электроника" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm text-muted-foreground">Slug</label>
            <Input v-model="form.slug" placeholder="elektronika" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm text-muted-foreground">Иконка (эмодзи)</label>
            <Input v-model="form.icon" placeholder="⚡" class="max-w-24" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm text-muted-foreground">Описание</label>
            <Input v-model="form.description" placeholder="Короткое описание" />
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
