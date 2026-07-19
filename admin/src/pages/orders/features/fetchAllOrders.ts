import { apiFetch } from '@/api/client'
import type { Order } from '@/pages/orders/models'

export function fetchAllOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/orders/all')
}
