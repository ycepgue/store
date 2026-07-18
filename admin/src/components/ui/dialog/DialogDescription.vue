<script setup lang="ts">
import { DialogDescription, type DialogDescriptionProps } from 'reka-ui'
import { cn } from '@/libs/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<DialogDescriptionProps & {
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <DialogDescription
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
