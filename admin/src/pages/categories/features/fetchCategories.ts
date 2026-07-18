import { apiFetch } from '@/api/client'
import type { Category } from '@/pages/categories/models'

export function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories', { auth: false })
}
