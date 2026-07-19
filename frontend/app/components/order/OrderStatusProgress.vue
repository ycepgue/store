<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_META,
  type OrderStatus,
} from '@/lib/order-status'

const props = defineProps<{ status: string }>()

const isCancelled = computed(() => props.status === 'cancelled')

// Индекс текущего шага в цепочке; -1 если статус вне цепочки.
const currentIndex = computed(() =>
  ORDER_STATUS_FLOW.indexOf(props.status as OrderStatus),
)

const steps = computed(() =>
  ORDER_STATUS_FLOW.map((status, i) => ({
    status,
    label: ORDER_STATUS_META[status].label,
    dotClass: ORDER_STATUS_META[status].dotClass,
    done: currentIndex.value >= 0 && i <= currentIndex.value,
  })),
)
</script>

<template>
  <div
    v-if="isCancelled"
    class="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400"
  >
    Заказ отменён
  </div>

  <div v-else class="flex items-center gap-1.5">
    <template v-for="(step, i) in steps" :key="step.status">
      <div class="flex items-center gap-1.5">
        <span
          :class="cn(
            'size-2 rounded-full transition-colors',
            step.done ? step.dotClass : 'bg-muted',
          )"
        />
        <span
          :class="cn(
            'text-[11px] leading-none whitespace-nowrap',
            step.done ? 'font-medium text-foreground' : 'text-muted-foreground',
          )"
        >
          {{ step.label }}
        </span>
      </div>
      <span
        v-if="i < steps.length - 1"
        :class="cn(
          'h-px min-w-3 flex-1 transition-colors',
          steps[i + 1]?.done ? 'bg-foreground/40' : 'bg-border',
        )"
      />
    </template>
  </div>
</template>
