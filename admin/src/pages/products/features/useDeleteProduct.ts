import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteProduct } from './deleteProduct'
import { productsKey } from './productsKey'

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKey }),
  })
}
