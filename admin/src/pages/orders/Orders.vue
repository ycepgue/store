<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { ORDER_STATUS_META, type OrderStatus } from '@/pages/orders/libs/order-status'
import { errorMessage } from '@/libs/utils'
import { useToast } from '@/libs/use-toast'
import type { Order } from '@/pages/orders/models'
import OrdersTable from './components/OrdersTable.vue'
import { useOrdersQuery, useUpdateOrderStatus } from './features'

const { data: orders, isLoading, isError } = useOrdersQuery()
const statusMutation = useUpdateOrderStatus()
const toast = useToast()

const statusOptions = Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({
  value: value as OrderStatus,
  label: meta.label,
}))

const savingId = ref<number | null>(null)

// --- Фильтрация и сортировка ---
const statusFilter = ref('all')
const sort = ref('newest')

const visibleOrders = computed(() => {
  const list = (orders.value ?? []).filter(
    (o) => statusFilter.value === 'all' || o.status === statusFilter.value,
  )
  return [...list].sort((a, b) => {
    if (sort.value === 'total') return b.total - a.total
    const cmp = a.createdAt.localeCompare(b.createdAt)
    return sort.value === 'oldest' ? cmp : -cmp
  })
})

function onStatusChange(order: Order, status: string) {
  if (status === order.status) return
  savingId.value = order.id
  const label = ORDER_STATUS_META[status as OrderStatus]?.label ?? status
  statusMutation.mutate(
    { id: order.id, status },
    {
      onSuccess: () => toast.success(`Заказ №${order.id}`, `Статус: ${label}`),
      onError: (e) =>
        toast.error(`Не удалось обновить заказ №${order.id}`, errorMessage(e)),
      onSettled: () => (savingId.value = null),
    },
  )
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold tracking-tight">Заказы</h1>

    <p v-if="isLoading" class="text-sm text-muted-foreground">Загрузка…</p>
    <p v-else-if="isError" class="text-sm text-destructive">
      Не удалось загрузить заказы.
    </p>
    <p v-else-if="!orders || orders.length === 0" class="text-sm text-muted-foreground">
      Заказов пока нет.
    </p>

    <template v-else>
      <div class="flex flex-wrap items-center gap-3">
        <Select v-model="statusFilter">
          <SelectTrigger class="w-48">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="sort">
          <SelectTrigger class="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Сначала новые</SelectItem>
            <SelectItem value="oldest">Сначала старые</SelectItem>
            <SelectItem value="total">По сумме</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OrdersTable
        :orders="visibleOrders"
        :status-options="statusOptions"
        :saving-id="savingId"
        @change-status="onStatusChange"
      />
    </template>
  </div>
</template>
