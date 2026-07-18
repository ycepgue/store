<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { register as registerRequest } from '@/api'

const { setSession, isAuthenticated } = useAuth()
const route = useRoute()
const redirect = computed(() => (route.query.redirect as string) || '/orders')

if (isAuthenticated.value) {
  await navigateTo(redirect.value)
}

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const res = await registerRequest({
      email: email.value,
      password: password.value,
      name: name.value || undefined,
    })
    setSession(res)
    await navigateTo(redirect.value)
  } catch (e: any) {
    error.value = e?.data?.message || 'Не удалось зарегистрироваться.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Регистрация — Store' })
</script>

<template>
  <div class="mx-auto max-w-sm py-8">
    <Card>
      <CardHeader>
        <CardTitle>Регистрация</CardTitle>
        <CardDescription>Создайте аккаунт для оформления заказов</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <div class="flex flex-col gap-1.5">
            <label for="name" class="text-sm font-medium">Имя</label>
            <Input id="name" v-model="name" type="text" placeholder="Как к вам обращаться" autocomplete="name" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-sm font-medium">Почта</label>
            <Input id="email" v-model="email" type="email" required placeholder="you@example.com" autocomplete="email" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="password" class="text-sm font-medium">Пароль</label>
            <Input id="password" v-model="password" type="password" required minlength="6" placeholder="Минимум 6 символов" autocomplete="new-password" />
          </div>
          <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
          <Button type="submit" :disabled="loading" class="w-full">
            {{ loading ? 'Создание…' : 'Зарегистрироваться' }}
          </Button>
          <p class="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?
            <NuxtLink :to="{ path: '/login', query: route.query }" class="font-medium text-foreground underline underline-offset-4">
              Войти
            </NuxtLink>
          </p>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
