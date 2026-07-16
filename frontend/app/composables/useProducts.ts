import { useQuery } from '@tanstack/vue-query'
import { fetchProducts } from '@/api'
import type { ProductsQuery } from '@/types'
import { computed, type Ref } from 'vue'

const PRODUCTS_KEY = 'products'

export function useProducts(query: Ref<ProductsQuery>) {
  return useQuery({
    queryKey: computed(() => [PRODUCTS_KEY, query.value]),
    queryFn: () => fetchProducts(query.value),
  })
}
