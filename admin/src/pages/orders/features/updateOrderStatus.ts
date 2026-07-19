import { apiFetch } from '@/api/client'
import type { Order } from '@/pages/orders/models'
import type { UpdateOrderStatusDto } from '@/pages/orders/dto'

export function updateOrderStatus(id: number, status: string): Promise<Order> {
  const body: UpdateOrderStatusDto = { status }
  return apiFetch<Order>(`/orders/${id}/status`, { method: 'PATCH', body })
}
