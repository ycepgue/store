import type { CartItem, Product } from '@/types'

const STORAGE_KEY = 'store-cart'

function persist(items: CartItem[]) {
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}

export function useCart() {
  const items = useState<CartItem[]>('cart-items', () => [])
  // Shared open state for the cart popover so it can be opened programmatically
  // (e.g. right after the first item is added).
  const isOpen = useState<boolean>('cart-open', () => false)

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  function addItem(product: Product, quantity = 1) {
    const wasEmpty = items.value.length === 0
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    persist(items.value)
    // Open the cart automatically when the first item lands in an empty cart.
    if (wasEmpty) {
      isOpen.value = true
    }
  }

  function removeItem(productId: number) {
    const idx = items.value.findIndex(i => i.product.id === productId)
    if (idx !== -1) {
      items.value.splice(idx, 1)
      persist(items.value)
    }
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity = quantity
      persist(items.value)
    }
  }

  function clearCart() {
    items.value.length = 0
    persist(items.value)
  }

  function hasItem(productId: number): boolean {
    return items.value.some(i => i.product.id === productId)
  }

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    hasItem,
  }
}
