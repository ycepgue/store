import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '@/api'
import type { ProductInput } from '@/types'

export const productsKey = ['products'] as const

export function useProductsQuery() {
  return useQuery({
    queryKey: productsKey,
    queryFn: fetchProducts,
    select: (data) => data.items,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductInput) => createProduct(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKey }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductInput> }) =>
      updateProduct(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKey }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKey }),
  })
}
