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
import type { Category } from '@/pages/categories/models'
import type { CategoryDto } from '@/pages/categories/dto'

const props = defineProps<{
  open: boolean
  category: Category | null
  saving: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [payload: CategoryDto]
}>()

// Инициализация один раз при монтировании; родитель ремаунтит диалог по :key
// на каждое открытие — поэтому watch на props.open не нужен.
const form = reactive({
  name: props.category?.name ?? '',
  slug: props.category?.slug ?? '',
  icon: props.category?.icon ?? '',
  description: props.category?.description ?? '',
})
const errorMsg = ref('')

function submit() {
  errorMsg.value = ''
  if (!form.name.trim() || !form.slug.trim()) {
    errorMsg.value = 'Название и slug обязательны.'
    return
  }
  emit('submit', {
    name: form.name.trim(),
    slug: form.slug.trim(),
    icon: form.icon.trim() || undefined,
    description: form.description.trim() || undefined,
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogTitle>{{ category ? 'Редактировать категорию' : 'Новая категория' }}</DialogTitle>
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
</template>
