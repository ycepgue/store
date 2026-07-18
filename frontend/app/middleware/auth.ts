/**
 * Route guard for pages that require a signed-in user. Redirects guests to the
 * login page, preserving the intended destination via a `redirect` query param.
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
