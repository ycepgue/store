import { apiFetch } from '@/api/client'
import type { Product } from '@/pages/products/models'
import type { ProductDto } from '@/pages/products/dto'

export function createProduct(payload: ProductDto): Promise<Product> {
  return apiFetch<Product>('/products', { method: 'POST', body: payload })
}
