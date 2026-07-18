import { computed, ref } from 'vue'
import { getToken, setToken } from '@/api/client'
import { login } from './login'
import type { AuthUser } from '@/pages/auth/models'
import type { LoginDto } from '@/pages/auth/dto'

const USER_KEY = 'admin-user'

function readUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  return JSON.parse(raw) as AuthUser
}

// Реактивное состояние на уровне модуля — общее для всего приложения.
const token = ref<string | null>(getToken())
const user = ref<AuthUser | null>(readUser())

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function signIn(dto: LoginDto) {
    const res = await login(dto)
    if (res.user.role !== 'admin') {
      throw new Error('У этого аккаунта нет прав администратора.')
    }
    setToken(res.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.user))
    token.value = res.token
    user.value = res.user
    return res.user
  }

  function logout() {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, isAdmin, signIn, logout }
}
