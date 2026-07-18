<script setup lang="ts">
import { computed, ref } from 'vue'
import { DateFormatter, getLocalTimeZone, parseDate, type DateValue } from '@internationalized/date'
import { CalendarIcon } from '@lucide/vue'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

const props = defineProps<{
  /** Selected date as an ISO `YYYY-MM-DD` string. */
  modelValue?: string
  /** Earliest selectable date as `YYYY-MM-DD`. */
  min?: string
  placeholder?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const formatter = new DateFormatter('ru-RU', { dateStyle: 'long' })
const open = ref(false)

const dateValue = computed(() => (props.modelValue ? parseDate(props.modelValue) : undefined))
const minValue = computed(() => (props.min ? parseDate(props.min) : undefined))

const label = computed(() =>
  dateValue.value
    ? formatter.format(dateValue.value.toDate(getLocalTimeZone()))
    : (props.placeholder ?? 'Выберите дату'),
)

function onSelect(value: DateValue | undefined) {
  if (value) {
    emit('update:modelValue', value.toString())
    open.value = false
  }
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        :class="cn(
          'flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-sm outline-none transition-colors hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30',
          !dateValue && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="size-4 shrink-0 text-muted-foreground" />
        <span class="truncate">{{ label }}</span>
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        align="start"
        :side-offset="4"
        class="z-50 w-auto rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-md outline-none"
      >
        <Calendar
          :model-value="dateValue"
          :min-value="minValue"
          initial-focus
          @update:model-value="onSelect"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
