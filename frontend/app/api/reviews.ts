import { apiBaseUrl } from './client'
import type { CreateReviewPayload, Review } from '@/types'

export function createReview(
  payload: CreateReviewPayload,
  token: string,
): Promise<Review> {
  return $fetch<Review>('/reviews', {
    method: 'POST',
    baseURL: apiBaseUrl(),
    body: payload,
    headers: { Authorization: `Bearer ${token}` },
  })
}
