<script setup lang="ts">
import { AppHeader } from '@/components/layout'
</script>

<template>
  <div class="min-h-dvh bg-background text-foreground">
    <AppHeader />

    <main class="relative mx-auto max-w-7xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
