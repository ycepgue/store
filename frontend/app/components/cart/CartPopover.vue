<script setup lang="ts">
import { ShoppingCart } from '@lucide/vue'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import CartDrawer from './CartDrawer.vue'

const { totalItems } = useCart()
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button
        class="relative inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
        title="Корзина"
      >
        <ShoppingCart class="size-4" />
        <span
          v-if="totalItems > 0"
          class="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
        >
          {{ totalItems > 99 ? '99+' : totalItems }}
        </span>
      </button>
    </PopoverTrigger>
    <PopoverContent side="bottom" align="end" :side-offset="8" class="bg-transparent border-none shadow-none p-0">
      <CartDrawer />
    </PopoverContent>
  </Popover>
</template>
