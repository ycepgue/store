/**
 * Route guard for auth pages (login/register). Sends already signed-in users
 * to their intended destination (or the orders page) instead of showing the form.
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated.value) {
    const redirect = (to.query.redirect as string) || '/orders'
    return navigateTo(redirect)
  }
})
