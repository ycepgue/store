import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateOrderStatus } from './updateOrderStatus'
import { ordersKey } from './ordersKey'

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ordersKey }),
  })
}
