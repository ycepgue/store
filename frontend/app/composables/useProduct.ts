import { useQuery } from '@tanstack/vue-query'
import { fetchProduct } from '@/api'
import { computed, type Ref } from 'vue'

const PRODUCT_KEY = 'product'

export function useProduct(id: Ref<number | string>) {
  return useQuery({
    queryKey: computed(() => [PRODUCT_KEY, id.value]),
    queryFn: () => fetchProduct(Number(id.value)),
    enabled: computed(() => !!id.value),
  })
}
