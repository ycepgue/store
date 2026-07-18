import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createProduct } from './createProduct'
import { productsKey } from './productsKey'
import type { ProductDto } from '@/pages/products/dto'

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductDto) => createProduct(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKey }),
  })
}
