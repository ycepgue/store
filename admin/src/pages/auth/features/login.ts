import { apiFetch } from '@/api/client'
import type { AuthResponse } from '@/pages/auth/models'
import type { LoginDto } from '@/pages/auth/dto'

export function login(dto: LoginDto): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: dto,
    auth: false,
  })
}
