<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/libs/use-toast'
import type { LoginDto } from '@/pages/auth/dto'
import { useAuth } from './features'

const route = useRoute()
const router = useRouter()
const { signIn } = useAuth()
const toast = useToast()

const form = reactive<LoginDto>({ email: '', password: '' })
const errorMsg = ref('')

const loginMutation = useMutation({
  mutationFn: (dto: LoginDto) => signIn(dto),
  onSuccess: () => {
    toast.success('Вход выполнен')
    const redirect = route.query.redirect as string | undefined
    router.push(redirect || { name: 'dashboard' })
  },
  onError: (e) => {
    errorMsg.value = e instanceof Error ? e.message : 'Не удалось войти.'
    toast.error('Не удалось войти', errorMsg.value)
  },
})

function submit() {
  errorMsg.value = ''
  loginMutation.mutate({ email: form.email.trim(), password: form.password })
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
            <Input id="email" v-model="form.email" type="email" autocomplete="username" placeholder="admin@example.com" />
          </div>
          <div class="space-y-1.5">
            <label for="password" class="text-sm text-muted-foreground">Пароль</label>
            <Input id="password" v-model="form.password" type="password" autocomplete="current-password" />
          </div>

          <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>

          <Button type="submit" class="w-full" :disabled="loginMutation.isPending.value">
            {{ loginMutation.isPending.value ? 'Вход…' : 'Войти' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
