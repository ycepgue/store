<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice, formatDate } from '@/libs/utils'
import type { Order } from '@/pages/orders/models'
import OrderStatusBadge from './OrderStatusBadge.vue'

defineProps<{
  orders: Order[]
  statusOptions: { value: string; label: string }[]
  savingId: number | null
}>()

const emit = defineEmits<{
  'change-status': [order: Order, status: string]
}>()
</script>

<template>
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
            {{ formatDate(order.createdAt) }}
          </TableCell>
          <TableCell class="whitespace-nowrap tabular-nums">
            {{ formatPrice(order.total) }}
          </TableCell>
          <TableCell>
            <OrderStatusBadge :status="order.status" />
          </TableCell>
          <TableCell>
            <Select
              :model-value="order.status"
              :disabled="savingId === order.id"
              @update:model-value="(v) => emit('change-status', order, String(v))"
            >
              <SelectTrigger size="sm" class="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
        <TableRow v-if="orders.length === 0">
          <TableCell colspan="6" class="py-6 text-center text-sm text-muted-foreground">
            Ничего не найдено.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
