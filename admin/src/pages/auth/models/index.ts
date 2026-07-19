export interface AuthUser {
  id: number
  email: string
  name: string | null
  role: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
