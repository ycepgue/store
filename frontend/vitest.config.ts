import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Юнит-тесты компонентов/утилит без полного стека Nuxt.
// Алиас `@` указывает на каталог app/ (srcDir Nuxt 4).
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['app/**/*.spec.ts'],
    globals: true,
  },
})
