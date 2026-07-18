<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { login as loginRequest } from '@/api'

const { setSession, isAuthenticated } = useAuth()
const route = useRoute()
const redirect = computed(() => (route.query.redirect as string) || '/orders')

if (isAuthenticated.value) {
  await navigateTo(redirect.value)
}

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const res = await loginRequest({ email: email.value, password: password.value })
    setSession(res)
    await navigateTo(redirect.value)
  } catch (e: any) {
    error.value = e?.data?.message || 'Не удалось войти. Проверьте данные.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Вход — Store' })
</script>

<template>
  <div class="mx-auto max-w-sm py-8">
    <Card>
      <CardHeader>
        <CardTitle>Вход</CardTitle>
        <CardDescription>Войдите, чтобы оформить и отслеживать заказы</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-sm font-medium">Почта</label>
            <Input id="email" v-model="email" type="email" required placeholder="you@example.com" autocomplete="email" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="password" class="text-sm font-medium">Пароль</label>
            <Input id="password" v-model="password" type="password" required placeholder="••••••••" autocomplete="current-password" />
          </div>
          <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
          <Button type="submit" :disabled="loading" class="w-full">
            {{ loading ? 'Вход…' : 'Войти' }}
          </Button>
          <p class="text-center text-sm text-muted-foreground">
            Нет аккаунта?
            <NuxtLink :to="{ path: '/register', query: route.query }" class="font-medium text-foreground underline underline-offset-4">
              Зарегистрироваться
            </NuxtLink>
          </p>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
