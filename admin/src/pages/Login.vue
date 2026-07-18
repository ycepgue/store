<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/composables/useAuth'
import { ApiError } from '@/api/client'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const submitting = ref(false)
const errorMsg = ref('')

async function submit() {
  errorMsg.value = ''
  submitting.value = true
  try {
    await login(email.value.trim(), password.value)
    const redirect = route.query.redirect as string | undefined
    router.push(redirect || { name: 'dashboard' })
  } catch (e) {
    if (e instanceof ApiError) errorMsg.value = e.message
    else if (e instanceof Error) errorMsg.value = e.message
    else errorMsg.value = 'Не удалось войти.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
    <Card class="w-full max-w-sm">
      <CardContent class="space-y-5 py-2">
        <div>
          <h1 class="text-lg font-bold tracking-tight">STORE · Админ-панель</h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Войдите под учётной записью администратора.
          </p>
        </div>

        <form class="space-y-3" @submit.prevent="submit">
          <div class="space-y-1.5">
            <label for="email" class="text-sm text-muted-foreground">Email</label>
            <Input id="email" v-model="email" type="email" autocomplete="username" placeholder="admin@example.com" />
          </div>
          <div class="space-y-1.5">
            <label for="password" class="text-sm text-muted-foreground">Пароль</label>
            <Input id="password" v-model="password" type="password" autocomplete="current-password" />
          </div>

          <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>

          <Button type="submit" class="w-full" :disabled="submitting">
            {{ submitting ? 'Вход…' : 'Войти' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
