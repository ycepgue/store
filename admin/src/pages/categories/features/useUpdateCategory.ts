import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateCategory } from './updateCategory'
import { categoriesKey } from './categoriesKey'
import type { CategoryDto } from '@/pages/categories/dto'

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CategoryDto> }) =>
      updateCategory(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKey }),
  })
}
