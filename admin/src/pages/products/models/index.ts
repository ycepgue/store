// Category-типы принадлежат странице категорий; ре-экспортируем для удобства товаров.
export type { Category, CategoryBrief } from '@/pages/categories/models'
import type { CategoryBrief } from '@/pages/categories/models'

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  images: string[]
  stock: number
  categoryId: number
  category?: CategoryBrief
  createdAt: string
}

export interface PaginatedProducts {
  items: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}
