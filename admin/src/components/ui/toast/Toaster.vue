<script setup lang="ts">
import { CheckCircle2, XCircle, X } from '@lucide/vue'
import { cn } from '@/libs/utils'
import { useToast } from '@/libs/use-toast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
    >
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0 sm:translate-x-4 sm:translate-y-0"
        enter-to-class="translate-x-0 translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in absolute"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-4 opacity-0"
        move-class="transition duration-200"
      >
        <div
          v-for="t in toasts"
          :key="t.id"
          role="status"
          class="pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-background p-3.5 shadow-lg"
        >
          <CheckCircle2
            v-if="t.variant === 'success'"
            class="mt-0.5 size-5 shrink-0 text-emerald-500"
          />
          <XCircle v-else class="mt-0.5 size-5 shrink-0 text-destructive" />

          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-foreground">{{ t.title }}</p>
            <p
              v-if="t.description"
              class="mt-0.5 text-sm text-muted-foreground"
            >
              {{ t.description }}
            </p>
          </div>

          <button
            type="button"
            :class="cn(
              'shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            )"
            title="Закрыть"
            @click="dismiss(t.id)"
          >
            <X class="size-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
