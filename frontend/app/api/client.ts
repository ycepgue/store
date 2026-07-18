/**
 * Resolves the API base URL for the current environment.
 * On the server (SSR) we use the private, internal URL; in the browser we use
 * the public one. Both are configurable via NUXT_API_BASE_URL /
 * NUXT_PUBLIC_API_BASE_URL.
 */
export function apiBaseUrl(): string {
  const config = useRuntimeConfig()
  // Prefer the internal URL on the server when one is configured; otherwise
  // fall back to the public URL used by the browser.
  if (import.meta.server && config.apiBaseUrl) return config.apiBaseUrl
  return config.public.apiBaseUrl
}
