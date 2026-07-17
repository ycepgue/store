import { apiBaseUrl } from './client'
import type { Category } from '@/types'

export function fetchCategories(): Promise<Category[]> {
  return $fetch<Category[]>('/categories', { baseURL: apiBaseUrl() })
}
