import { reactive } from 'vue'
import type { CartItem, Product } from '@/types'

const STORAGE_KEY = 'store-cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as CartItem[]
  } catch { /* ignore */ }
  return []
}

const state = reactive({
  items: loadCart(),
})

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
}

export const cartStore = {
  /** All cart items (reactive) */
  get items(): CartItem[] {
    return state.items
  },

  /** Total quantity of all items */
  get totalItems(): number {
    return state.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  /** Total price of all items */
  get totalPrice(): number {
    return state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  },

  addItem(product: Product, quantity = 1) {
    const existing = state.items.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      state.items.push({ product, quantity })
    }
    persist()
  },

  removeItem(productId: number) {
    const idx = state.items.findIndex(i => i.product.id === productId)
    if (idx !== -1) {
      state.items.splice(idx, 1)
      persist()
    }
  },

  updateQuantity(productId: number, quantity: number) {
    const item = state.items.find(i => i.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = quantity
        persist()
      }
    }
  },

  clearCart() {
    state.items.length = 0
    persist()
  },

  hasItem(productId: number): boolean {
    return state.items.some(i => i.product.id === productId)
  },
}

export type CartStore = typeof cartStore

