<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/libs/utils'
import { orderStatusMeta } from '@/pages/orders/libs/order-status'

const props = defineProps<{
  status: string
  class?: string
}>()

const meta = computed(() => orderStatusMeta(props.status))
</script>

<template>
  <span
    :class="cn(
      'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
      meta.badgeClass,
      props.class,
    )"
  >
    <span :class="cn('size-1.5 rounded-full', meta.dotClass)" />
    {{ meta.label }}
  </span>
</template>
