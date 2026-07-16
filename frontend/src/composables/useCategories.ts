import { useQuery } from '@tanstack/vue-query'
import { fetchCategories } from '@/api'

const CATEGORIES_KEY = 'categories'

export function useCategories() {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: fetchCategories,
  })
}
