<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { firstImage } from '@/lib/utils'
import { ShoppingCart, Minus, Plus, Trash2 } from '@lucide/vue'

const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
const { isAuthenticated } = useAuth()

const priceFormat = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

// Resolve the destination up front so we never trigger a mid-navigation
// redirect (which orphans the page transition). Guests go straight to login.
function goToCheckout() {
  return navigateTo(
    isAuthenticated.value ? '/checkout' : '/login?redirect=/checkout',
  )
}
</script>

<template>
  <div class="flex w-[calc(100vw-1rem)] max-w-[min(360px,var(--reka-popper-available-width,360px))] flex-col bg-card text-card-foreground rounded-xl shadow-xl border border-border">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <div class="flex items-center gap-2">
        <ShoppingCart class="size-4" />
        <span class="text-sm font-semibold">Корзина</span>
        <span v-if="totalItems > 0" class="text-xs text-muted-foreground">
          ({{ totalItems }})
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="items.length === 0"
      class="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center"
    >
      <ShoppingCart class="size-8 text-muted-foreground/40" />
      <p class="text-sm font-medium">Корзина пуста</p>
      <p class="text-xs text-muted-foreground">
        Добавьте товары из каталога
      </p>
    </div>

    <!-- Items -->
    <div v-else class="max-h-80 overflow-y-auto">
      <div class="divide-y divide-border">
        <div
          v-for="item in items"
          :key="item.product.id"
          class="flex gap-3 px-4 py-2.5"
        >
          <!-- Image -->
          <div class="size-12 shrink-0 overflow-hidden rounded-md bg-muted/30">
            <img
              v-if="item.product.images.length"
              :src="firstImage(item.product.images)"
              :alt="item.product.name"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full items-center justify-center text-sm font-bold text-muted-foreground/30"
            >
              {{ item.product.name.charAt(0) }}
            </div>
          </div>

          <!-- Info -->
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div class="flex items-start justify-between gap-1">
              <p class="truncate text-xs font-medium leading-tight">
                {{ item.product.name }}
              </p>
              <button
                class="-mr-1 -mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                @click="removeItem(item.product.id)"
              >
                <Trash2 class="size-3.5" />
              </button>
            </div>
            <p class="text-xs text-muted-foreground">
              {{ priceFormat(item.product.price) }}
            </p>
            <div class="flex items-center gap-1.5">
              <button
                class="inline-flex size-7 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                @click="updateQuantity(item.product.id, item.quantity - 1)"
              >
                <Minus class="size-3.5" />
              </button>
              <span class="w-7 text-center text-sm tabular-nums">
                {{ item.quantity }}
              </span>
              <button
                class="inline-flex size-7 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                @click="updateQuantity(item.product.id, item.quantity + 1)"
              >
                <Plus class="size-3.5" />
              </button>
              <span class="ml-auto text-xs font-semibold tabular-nums">
                {{ priceFormat(item.product.price * item.quantity) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="items.length > 0" class="border-t border-border px-4 py-3">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-medium">Итого</span>
        <span class="text-sm font-bold tabular-nums">
          {{ priceFormat(totalPrice) }}
        </span>
      </div>
      <div class="flex gap-2">
        <Button
          variant="outline"
          size="default"
          class="flex-1"
          @click="clearCart"
        >
          Очистить
        </Button>
        <Button size="default" class="flex-[2]" @click="goToCheckout">
          Оформить заказ
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes cartIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

div {
  animation: cartIn 150ms ease-out;
}
</style>
