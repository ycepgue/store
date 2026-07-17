import { fetchProduct } from '@/api'
import type { Ref } from 'vue'

export function useProduct(id: Ref<number | string>) {
  const asyncData = useAsyncData(
    `product:${id.value}`,
    () => fetchProduct(Number(id.value)),
    { watch: [id] },
  )

  return Object.assign(asyncData, {
    isLoading: computed(() => asyncData.status.value === 'pending'),
    isError: computed(() => asyncData.status.value === 'error'),
  })
}
