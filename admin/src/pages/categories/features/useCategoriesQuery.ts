import { useQuery } from '@tanstack/vue-query'
import { fetchCategories } from './fetchCategories'
import { categoriesKey } from './categoriesKey'

export function useCategoriesQuery() {
  return useQuery({ queryKey: categoriesKey, queryFn: fetchCategories })
}
