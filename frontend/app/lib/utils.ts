import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function imageUrl(path: string): string {
  if (path.startsWith('http')) return path
  const { apiBaseUrl } = useRuntimeConfig().public
  return `${new URL(apiBaseUrl).origin}${path}`
}

export function firstImage(images: string[]): string | undefined {
  return images.length > 0 ? imageUrl(images[0]) : undefined
}
