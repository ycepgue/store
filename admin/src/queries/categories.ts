import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '@/api'
import type { CategoryInput } from '@/types'

export const categoriesKey = ['categories'] as const

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesKey,
    queryFn: fetchCategories,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CategoryInput) => createCategory(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKey }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<CategoryInput>
    }) => updateCategory(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKey }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKey }),
  })
}
