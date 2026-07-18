import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateProduct } from './updateProduct'
import { productsKey } from './productsKey'
import type { ProductDto } from '@/pages/products/dto'

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductDto> }) =>
      updateProduct(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKey }),
  })
}
