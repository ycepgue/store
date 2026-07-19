import { apiFetch } from '@/api/client'
import type { Category } from '@/pages/categories/models'
import type { CategoryDto } from '@/pages/categories/dto'

export function createCategory(payload: CategoryDto): Promise<Category> {
  return apiFetch<Category>('/categories', { method: 'POST', body: payload })
}
