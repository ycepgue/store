import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3002,
  },
  plugins: [
    VueRouter({
      routesFolder: 'src/pages',
    }),
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
