<script setup lang="ts">
import { computed } from 'vue'
import { parseTime, type Time } from '@internationalized/date'
import { TimeFieldInput, TimeFieldRoot } from 'reka-ui'
import { ClockIcon } from '@lucide/vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  /** Selected time as `HH:MM` (24h). */
  modelValue?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const pad = (n: number) => String(n).padStart(2, '0')

const value = computed<Time | undefined>({
  get() {
    if (!props.modelValue) return undefined
    try {
      return parseTime(props.modelValue)
    } catch {
      return undefined
    }
  },
  set(v) {
    if (v) emit('update:modelValue', `${pad(v.hour)}:${pad(v.minute)}`)
  },
})
</script>

<template>
  <TimeFieldRoot
    v-slot="{ segments }"
    v-model="value"
    :hour-cycle="24"
    granularity="minute"
    :class="cn(
      'flex h-8 w-full items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30',
    )"
  >
    <ClockIcon class="size-4 shrink-0 text-muted-foreground" />
    <div class="flex items-center">
      <template v-for="item in segments" :key="item.part">
        <TimeFieldInput
          v-if="item.part === 'literal'"
          :part="item.part"
          class="text-muted-foreground"
        >
          {{ item.value }}
        </TimeFieldInput>
        <TimeFieldInput
          v-else
          :part="item.part"
          class="rounded px-0.5 tabular-nums outline-none focus:bg-primary focus:text-primary-foreground data-[placeholder]:text-muted-foreground"
        >
          {{ item.value }}
        </TimeFieldInput>
      </template>
    </div>
  </TimeFieldRoot>
</template>
