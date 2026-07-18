import { apiBaseUrl } from './client'
import type { AuthResponse } from '@/types'

export function register(payload: {
  email: string
  password: string
  name?: string
}): Promise<AuthResponse> {
  return $fetch<AuthResponse>('/auth/register', {
    baseURL: apiBaseUrl(),
    method: 'POST',
    body: payload,
  })
}

export function login(payload: {
  email: string
  password: string
}): Promise<AuthResponse> {
  return $fetch<AuthResponse>('/auth/login', {
    baseURL: apiBaseUrl(),
    method: 'POST',
    body: payload,
  })
}
