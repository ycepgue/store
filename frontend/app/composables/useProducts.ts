import { fetchProducts } from '@/api'
import type { ProductsQuery } from '@/types'
import type { Ref } from 'vue'

/**
 * SSR-friendly products query. Pass a distinct `key` per call site so unrelated
 * lists (e.g. homepage "featured" vs. catalog) don't share a payload entry.
 */
export function useProducts(query: Ref<ProductsQuery>, key = 'products') {
  const asyncData = useAsyncData(key, () => fetchProducts(query.value), {
    watch: [query],
  })

  return Object.assign(asyncData, {
    isLoading: computed(() => asyncData.status.value === 'pending'),
    isError: computed(() => asyncData.status.value === 'error'),
  })
}
