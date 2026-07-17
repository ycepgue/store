import { fetchCategories } from '@/api'

export function useCategories() {
  const asyncData = useAsyncData('categories', fetchCategories)

  return Object.assign(asyncData, {
    isLoading: computed(() => asyncData.status.value === 'pending'),
    isError: computed(() => asyncData.status.value === 'error'),
  })
}
