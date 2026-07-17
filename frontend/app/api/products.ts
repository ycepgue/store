import { apiBaseUrl } from './client'
import type { PaginatedProducts, Product, ProductsQuery } from '@/types'

export function fetchProducts(query: ProductsQuery = {}): Promise<PaginatedProducts> {
  const params: Record<string, string | number> = {}

  if (query.categoryId) params.categoryId = query.categoryId
  if (query.search) params.search = query.search
  if (query.sortBy) params.sortBy = query.sortBy
  if (query.sortOrder) params.sortOrder = query.sortOrder
  if (query.page) params.page = query.page
  if (query.limit) params.limit = query.limit

  return $fetch<PaginatedProducts>('/products', { baseURL: apiBaseUrl(), params })
}

export function fetchProduct(id: number): Promise<Product> {
  return $fetch<Product>(`/products/${id}`, { baseURL: apiBaseUrl() })
}
