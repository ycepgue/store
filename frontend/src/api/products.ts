import apiClient from './client'
import type { PaginatedProducts, Product, ProductsQuery } from '@/types'

export async function fetchProducts(query: ProductsQuery = {}): Promise<PaginatedProducts> {
  const params: Record<string, string | number> = {}

  if (query.categoryId) params.categoryId = query.categoryId
  if (query.search) params.search = query.search
  if (query.sortBy) params.sortBy = query.sortBy
  if (query.sortOrder) params.sortOrder = query.sortOrder
  if (query.page) params.page = query.page
  if (query.limit) params.limit = query.limit

  const { data } = await apiClient.get<PaginatedProducts>('/products', { params })
  return data
}

export async function fetchProduct(id: number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`)
  return data
}
