import { apiFetch } from '@/api/client'
import type { Category } from '@/pages/categories/models'
import type { CategoryDto } from '@/pages/categories/dto'

export function updateCategory(
  id: number,
  payload: Partial<CategoryDto>,
): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}
