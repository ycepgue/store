import { apiBaseUrl } from './client'
import type { CreateOrderPayload, Order } from '@/types'

export function createOrder(
  payload: CreateOrderPayload,
  token: string,
): Promise<Order> {
  return $fetch<Order>('/orders', {
    baseURL: apiBaseUrl(),
    method: 'POST',
    body: payload,
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function fetchOrders(token: string): Promise<Order[]> {
  return $fetch<Order[]>('/orders', {
    baseURL: apiBaseUrl(),
    headers: { Authorization: `Bearer ${token}` },
  })
}
