import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createCategory } from './createCategory'
import { categoriesKey } from './categoriesKey'
import type { CategoryDto } from '@/pages/categories/dto'

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CategoryDto) => createCategory(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKey }),
  })
}
