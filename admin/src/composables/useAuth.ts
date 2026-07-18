import { computed, ref } from 'vue'
import { getToken, setToken } from '@/api/client'
import { login as apiLogin } from '@/api'
import type { AuthUser } from '@/types'

const USER_KEY = 'admin-user'

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

// Реактивное состояние на уровне модуля — общее для всего приложения.
const token = ref<string | null>(getToken())
const user = ref<AuthUser | null>(readUser())

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string) {
    const res = await apiLogin(email, password)
    if (res.user.role !== 'admin') {
      throw new Error('У этого аккаунта нет прав администратора.')
    }
    setToken(res.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.user))
    token.value = res.token
    user.value = res.user
  }

  function logout() {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, isAdmin, login, logout }
}
