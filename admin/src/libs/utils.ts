import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Достаёт человекочитаемое сообщение из ошибки (ApiError тоже наследует Error).
export function errorMessage(e: unknown, fallback = 'Что-то пошло не так.') {
  return e instanceof Error ? e.message : fallback
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
