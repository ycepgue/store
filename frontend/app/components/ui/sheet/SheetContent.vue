<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui'
import { X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { computed, type HTMLAttributes } from 'vue'

type Side = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(
  defineProps<DialogContentProps & {
    class?: HTMLAttributes['class']
    side?: Side
  }>(),
  { side: 'left' },
)
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = computed(() => {
  const { class: _class, side: _side, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegatedProps, emits)

const sideClasses: Record<Side, string> = {
  top: 'inset-x-0 top-0 h-auto border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top',
  bottom: 'inset-x-0 bottom-0 h-auto border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
  left: 'inset-y-0 left-0 h-full w-3/4 max-w-xs border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
  right: 'inset-y-0 right-0 h-full w-3/4 max-w-xs border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
}
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      v-bind="forwarded"
      :class="cn(
        'fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg outline-none border-border transition ease-in-out',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:duration-300 data-[state=closed]:duration-200',
        sideClasses[props.side],
        props.class,
      )"
    >
      <slot />
      <DialogClose
        class="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
      >
        <X class="size-4" />
        <span class="sr-only">Закрыть</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
