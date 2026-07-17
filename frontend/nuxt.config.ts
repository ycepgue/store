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
    pageTransition: { name: 'page', mode: 'out-in' },

    head: {
      title: 'Store',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          key: 'theme-init',
          innerHTML: `(function(){try{var s=localStorage.getItem('vueuse-color-scheme');var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
        },
      ],
    },
  },

  runtimeConfig: {
    // Optional internal URL for server-side (SSR) requests. Leave empty to
    // reuse the public URL; set NUXT_API_BASE_URL only when the server should
    // reach the backend at a different (internal) address than the browser.
    apiBaseUrl: '',
    public: {
      // URL used by the browser and, by default, by SSR too.
      // Override via NUXT_PUBLIC_API_BASE_URL.
      apiBaseUrl: 'http://localhost:3001/api',
    },
  },

  devServer: {
    port: 3002,
  },
})
