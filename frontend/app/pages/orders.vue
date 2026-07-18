<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { fetchOrders } from '@/api'
import type { Order } from '@/types'

const { token, isAuthenticated } = useAuth()
const route = useRoute()

if (!isAuthenticated.value) {
  await navigateTo('/login?redirect=/orders')
}

const placedId = computed(() => route.query.placed as string | undefined)

const priceFormat = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

const dateFormat = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

const STATUS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'В обработке', variant: 'secondary' },
  confirmed: { label: 'Подтверждён', variant: 'default' },
  shipped: { label: 'В доставке', variant: 'default' },
  delivered: { label: 'Доставлен', variant: 'outline' },
  cancelled: { label: 'Отменён', variant: 'destructive' },
}

const statusInfo = (status: string) =>
  STATUS[status] ?? { label: status, variant: 'secondary' as const }

const { data: orders, pending, error } = await useAsyncData<Order[]>(
  'my-orders',
  () => fetchOrders(token.value!),
)

useHead({ title: 'Мои заказы — Store' })
</script>

<template>
  <div class="py-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold tracking-tight">Мои заказы</h1>
      <Button as-child variant="outline" size="sm">
        <NuxtLink to="/products">В каталог</NuxtLink>
      </Button>
    </div>

    <div v-if="placedId" class="mb-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
      Заказ №{{ placedId }} успешно оформлен. Мы свяжемся с вами для подтверждения.
    </div>

    <div v-if="pending" class="text-sm text-muted-foreground">Загрузка…</div>

    <div v-else-if="error" class="text-sm text-destructive">
      Не удалось загрузить заказы. Попробуйте обновить страницу.
    </div>

    <div v-else-if="!orders || orders.length === 0" class="rounded-lg border border-border p-8 text-center">
      <p class="text-sm text-muted-foreground">У вас пока нет заказов.</p>
      <Button as-child class="mt-4">
        <NuxtLink to="/products">Перейти в каталог</NuxtLink>
      </Button>
    </div>

    <div v-else class="flex flex-col gap-4">
      <Card v-for="order in orders" :key="order.id">
        <CardContent class="flex flex-col gap-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-3">
              <span class="font-semibold">Заказ №{{ order.id }}</span>
              <Badge :variant="statusInfo(order.status).variant">
                {{ statusInfo(order.status).label }}
              </Badge>
            </div>
            <span class="text-sm text-muted-foreground">{{ dateFormat(order.createdAt) }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center justify-between gap-2 text-sm"
            >
              <span class="min-w-0 flex-1 truncate">
                {{ item.productName }}
                <span class="text-muted-foreground"> × {{ item.quantity }}</span>
              </span>
              <span class="shrink-0 tabular-nums">{{ priceFormat(item.price * item.quantity) }}</span>
            </div>
          </div>

          <Separator />

          <div class="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            <div class="text-muted-foreground">Адрес</div>
            <div class="sm:text-right">{{ order.address }}</div>
            <template v-if="order.deliveryDate">
              <div class="text-muted-foreground">Доставка</div>
              <div class="sm:text-right">
                {{ dateFormat(order.deliveryDate) }}<span v-if="order.deliverySlot">, {{ order.deliverySlot }}</span>
              </div>
            </template>
            <template v-if="order.comment">
              <div class="text-muted-foreground">Комментарий</div>
              <div class="sm:text-right">{{ order.comment }}</div>
            </template>
          </div>

          <div class="flex items-center justify-between border-t border-border pt-3 font-semibold">
            <span>Итого</span>
            <span class="tabular-nums">{{ priceFormat(order.total) }}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
