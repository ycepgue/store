import axios from 'axios'

export function apiClient() {
  const { apiBaseUrl } = useRuntimeConfig().public
  return axios.create({
    baseURL: apiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
  })
}
