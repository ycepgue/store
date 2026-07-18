import { useQuery } from '@tanstack/vue-query'
import { fetchProducts } from './fetchProducts'
import { productsKey } from './productsKey'

export function useProductsQuery() {
  return useQuery({
    queryKey: productsKey,
    queryFn: fetchProducts,
    select: (data) => data.items,
  })
}
