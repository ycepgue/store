<script setup lang="ts">
import { ShoppingCart } from '@lucide/vue'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import CartDrawer from './CartDrawer.vue'

// `isOpen` is shared via useCart so adding the first item can open the cart.
const { totalItems, isOpen } = useCart()

// Close the popover whenever the route changes (e.g. after tapping "Оформить
// заказ"), since the popover lives in the persistent header.
const route = useRoute()
watch(() => route.fullPath, () => { isOpen.value = false })
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        class="relative inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
        title="Корзина"
      >
        <ShoppingCart class="size-4" />
        <!-- Cart count comes from localStorage (client-only), so keep it out of
             SSR/hydration to avoid a mismatch with the async layout. -->
        <ClientOnly>
          <span
            v-if="totalItems > 0"
            class="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
          >
            {{ totalItems > 99 ? '99+' : totalItems }}
          </span>
        </ClientOnly>
      </button>
    </PopoverTrigger>
    <PopoverContent side="bottom" align="end" :side-offset="8" :collision-padding="8" class="w-auto bg-transparent border-none shadow-none p-0">
      <CartDrawer />
    </PopoverContent>
  </Popover>
</template>
