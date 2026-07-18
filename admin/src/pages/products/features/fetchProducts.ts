import { apiFetch } from '@/api/client'
import type { PaginatedProducts } from '@/pages/products/models'

export function fetchProducts(): Promise<PaginatedProducts> {
  return apiFetch<PaginatedProducts>(
    '/products?limit=100&sortBy=createdAt&sortOrder=desc',
    { auth: false },
  )
}
