<script setup lang="ts">
import { ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { NativeSelect } from '@/components/ui/native-select'
import OrderStatusBadge from '@/components/order/OrderStatusBadge.vue'
import { ORDER_STATUS_META, type OrderStatus } from '@/lib/order-status'
import { useOrdersQuery, useUpdateOrderStatus } from '@/queries/orders'
import { ApiError } from '@/api/client'
import type { Order } from '@/types'

const { data: orders, isLoading, isError } = useOrdersQuery()
const statusMutation = useUpdateOrderStatus()

const statusOptions = Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({
  value: value as OrderStatus,
  label: meta.label,
}))

const savingId = ref<number | null>(null)
const errorMsg = ref('')

const priceFormat = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
const dateFormat = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

async function onStatusChange(order: Order, status: string) {
  savingId.value = order.id
  errorMsg.value = ''
  try {
    await statusMutation.mutateAsync({ id: order.id, status })
  } catch (e) {
    errorMsg.value =
      e instanceof ApiError ? e.message : `Не удалось обновить заказ №${order.id}.`
  } finally {
    savingId.value = null
  }
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
      <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>
      <div class="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Изменить</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="order in orders" :key="order.id">
              <TableCell class="font-medium">{{ order.id }}</TableCell>
              <TableCell>
                <div>{{ order.customerName }}</div>
                <div class="text-xs text-muted-foreground">{{ order.customerEmail }}</div>
              </TableCell>
              <TableCell class="whitespace-nowrap text-sm text-muted-foreground">
                {{ dateFormat(order.createdAt) }}
              </TableCell>
              <TableCell class="whitespace-nowrap tabular-nums">
                {{ priceFormat(order.total) }}
              </TableCell>
              <TableCell>
                <OrderStatusBadge :status="order.status" />
              </TableCell>
              <TableCell>
                <NativeSelect
                  :model-value="order.status"
                  size="sm"
                  :disabled="savingId === order.id"
                  @update:model-value="(v?: unknown) => onStatusChange(order, String(v))"
                >
                  <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </NativeSelect>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
  </div>
</template>
