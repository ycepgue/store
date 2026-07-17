<script setup lang="ts">
import type { NuxtError } from '#app'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () => (is404.value ? 'Страница не найдена — Store' : 'Ошибка — Store'),
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col items-center justify-center gap-4 py-32 text-center">
      <p class="text-6xl font-bold tracking-tight text-primary">
        {{ error.statusCode }}
      </p>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold">
          {{ is404 ? 'Страница не найдена' : 'Что-то пошло не так' }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{
            is404
              ? 'Возможно, страница была удалена или ссылка неверна.'
              : (error.statusMessage || 'Произошла непредвиденная ошибка.')
          }}
        </p>
      </div>
      <Button @click="goHome">
        Вернуться на главную
      </Button>
    </div>
  </NuxtLayout>
</template>
