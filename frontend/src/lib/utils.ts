import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_BASE = 'http://localhost:3001'

export function imageUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

export function firstImage(images: string[]): string | undefined {
  return images.length > 0 ? imageUrl(images[0]) : undefined
}
