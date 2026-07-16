import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-16',
  devtools: { enabled: true },

  modules: ['@vueuse/nuxt'],

  css: ['~/assets/index.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  components: {
    dirs: [
      { path: '~/components/ui', pattern: '*.vue' },
      { path: '~/components/cart', pattern: '*.vue' },
    ],
  },

  app: {
    head: {
      title: 'Store',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:3001/api',
    },
  },

  devServer: {
    port: 3002,
  },
})
