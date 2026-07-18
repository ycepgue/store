<script setup lang="ts">
import {
  SelectIcon,
  SelectTrigger,
  type SelectTriggerProps,
  useForwardProps,
} from 'reka-ui'
import { ChevronDownIcon } from '@lucide/vue'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<
  SelectTriggerProps & {
    class?: HTMLAttributes['class']
    size?: 'sm' | 'default'
  }
>()

const delegatedProps = computed(() => {
  const { class: _class, size: _size, ...rest } = props
  return rest
})

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <SelectTrigger
    v-bind="forwarded"
    data-slot="select-trigger"
    :data-size="props.size ?? 'default'"
    :class="cn(
      'border-input flex h-8 w-full items-center justify-between gap-2 rounded-lg border bg-transparent px-2.5 py-1 text-sm whitespace-nowrap transition-colors outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
      'dark:bg-input/30 dark:hover:bg-input/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[size=sm]:h-7 data-[placeholder]:text-muted-foreground',
      '[&>span]:line-clamp-1 [&>span]:truncate',
      props.class,
    )"
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDownIcon class="size-4 shrink-0 text-muted-foreground" />
    </SelectIcon>
  </SelectTrigger>
</template>
