import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteCategory } from './deleteCategory'
import { categoriesKey } from './categoriesKey'

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKey }),
  })
}
