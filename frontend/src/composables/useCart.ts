import { computed } from 'vue'
import { cartStore } from '@/stores/cart'

export function useCart() {
  return {
    items: computed(() => cartStore.items),
    totalItems: computed(() => cartStore.totalItems),
    totalPrice: computed(() => cartStore.totalPrice),
    addItem: cartStore.addItem.bind(cartStore),
    removeItem: cartStore.removeItem.bind(cartStore),
    updateQuantity: cartStore.updateQuantity.bind(cartStore),
    clearCart: cartStore.clearCart.bind(cartStore),
    hasItem: cartStore.hasItem.bind(cartStore),
  }
}
