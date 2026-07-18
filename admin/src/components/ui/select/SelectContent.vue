<script setup lang="ts">
import {
  SelectContent,
  type SelectContentEmits,
  type SelectContentProps,
  SelectPortal,
  SelectViewport,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = withDefaults(
  defineProps<SelectContentProps & { class?: HTMLAttributes['class'] }>(),
  { position: 'popper', sideOffset: 4 },
)
const emits = defineEmits<SelectContentEmits>()

const delegatedProps = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="forwarded"
      data-slot="select-content"
      :class="cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        props.position === 'popper' && 'min-w-[var(--reka-select-trigger-width)]',
        props.class,
      )"
    >
      <SelectViewport
        :class="cn('p-1', props.position === 'popper' && 'w-full')"
      >
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>
