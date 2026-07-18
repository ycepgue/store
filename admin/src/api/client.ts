const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api'

const TOKEN_KEY = 'admin-token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Событие для глобальной реакции на разлогин (протухший/битый токен).
export const AUTH_EXPIRED_EVENT = 'admin:auth-expired'

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
}

export async function apiFetch<T>(
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    setToken(null)
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
    throw new ApiError(401, 'Сессия истекла. Войдите заново.')
  }

  if (!res.ok) {
    let message = `Ошибка ${res.status}`
    try {
      const data = await res.json()
      if (typeof data?.message === 'string') message = data.message
      else if (Array.isArray(data?.message)) message = data.message.join(', ')
    } catch {
      // тело не JSON — оставляем дефолтное сообщение
    }
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
