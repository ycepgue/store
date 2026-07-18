import { apiFetch } from '@/api/client'
import type { Product } from '@/pages/products/models'
import type { ProductDto } from '@/pages/products/dto'

export function updateProduct(
  id: number,
  payload: Partial<ProductDto>,
): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { method: 'PATCH', body: payload })
}
