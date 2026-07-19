import { apiFetch } from '@/api/client'

export function deleteCategory(id: number): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, { method: 'DELETE' })
}
