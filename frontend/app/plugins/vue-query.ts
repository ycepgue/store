import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxt) => {
  const queryClient = new QueryClient()
  nuxt.vueApp.use(VueQueryPlugin, { queryClient })

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      nuxt.payload.vueQueryState = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    hydrate(queryClient, nuxt.payload.vueQueryState)
  }
})
