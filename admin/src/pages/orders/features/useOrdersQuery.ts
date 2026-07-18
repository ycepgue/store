import { useQuery } from '@tanstack/vue-query'
import { fetchAllOrders } from './fetchAllOrders'
import { ordersKey } from './ordersKey'

export function useOrdersQuery() {
  return useQuery({ queryKey: ordersKey, queryFn: fetchAllOrders })
}
