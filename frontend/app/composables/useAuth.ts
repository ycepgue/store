import type { AuthResponse, AuthUser } from '@/types'

/**
 * Auth state shared across the app. The JWT is kept in a cookie so it survives
 * reloads and is available during SSR; the user object is mirrored in a cookie
 * too so the header can render the signed-in state without a round-trip.
 */
export function useAuth() {
  const token = useCookie<string | null>('auth-token', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  const user = useCookie<AuthUser | null>('auth-user', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  const isAuthenticated = computed(() => !!token.value)

  function setSession(res: AuthResponse) {
    token.value = res.token
    user.value = res.user
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, setSession, logout }
}
