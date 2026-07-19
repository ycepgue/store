<script setup lang="ts">
import { computed, ref } from 'vue'
import { Star } from '@lucide/vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    // Текущее значение (в режиме ввода — через v-model).
    modelValue?: number
    // Значение для отображения (режим «только чтение»).
    rating?: number
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { modelValue: 0, rating: 0, readonly: true, size: 'md' },
)

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const hovered = ref(0)

const value = computed(() => (props.readonly ? props.rating : props.modelValue))

// В интерактивном режиме подсвечиваем по наведению, иначе — по значению.
const shown = computed(() =>
  props.readonly ? value.value : hovered.value || value.value,
)

const sizeClass = computed(
  () => ({ sm: 'size-3.5', md: 'size-5', lg: 'size-7' })[props.size],
)

function pick(n: number) {
  if (props.readonly) return
  emit('update:modelValue', n)
}
</script>

<template>
  <div
    :class="cn('inline-flex items-center gap-0.5', !readonly && 'cursor-pointer')"
    role="img"
    :aria-label="`Рейтинг ${value} из 5`"
  >
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      :disabled="readonly"
      :tabindex="readonly ? -1 : 0"
      class="disabled:cursor-default"
      :aria-label="`${n} из 5`"
      @click="pick(n)"
      @mouseenter="!readonly && (hovered = n)"
      @mouseleave="!readonly && (hovered = 0)"
    >
      <Star
        :class="cn(
          sizeClass,
          'transition-colors',
          n <= shown
            ? 'fill-amber-400 text-amber-400'
            : 'fill-transparent text-muted-foreground/40',
        )"
      />
    </button>
  </div>
</template>
