import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { fetchAllOrders, updateOrderStatus } from '@/api'

export const ordersKey = ['orders'] as const

export function useOrdersQuery() {
  return useQuery({
    queryKey: ordersKey,
    queryFn: fetchAllOrders,
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ordersKey }),
  })
}
