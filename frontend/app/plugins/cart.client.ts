import type { CartItem } from '@/types'

const STORAGE_KEY = 'store-cart'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const items = useState<CartItem[]>('cart-items', () => [])
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) items.value = JSON.parse(raw) as CartItem[]
    } catch {
      /* ignore */
    }
  })
})
