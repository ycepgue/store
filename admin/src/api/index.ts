// Общий HTTP-слой. Конкретные запросы живут в своих фичах (features/*/api.ts).
export {
  apiFetch,
  ApiError,
  getToken,
  setToken,
  AUTH_EXPIRED_EVENT,
} from './client'
