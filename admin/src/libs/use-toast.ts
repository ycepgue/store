import { ref } from 'vue'

export type ToastVariant = 'success' | 'error'

export interface Toast {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

// Модульное состояние — одна очередь тостов на всё приложение.
const toasts = ref<Toast[]>([])
let seq = 0

const DEFAULT_DURATION = 4000

function push(variant: ToastVariant, title: string, description?: string) {
  const id = ++seq
  toasts.value.push({ id, title, description, variant })
  setTimeout(() => dismiss(id), DEFAULT_DURATION)
  return id
}

function dismiss(id: number) {
  const i = toasts.value.findIndex((t) => t.id === id)
  if (i !== -1) toasts.value.splice(i, 1)
}

export function useToast() {
  return {
    toasts,
    dismiss,
    success: (title: string, description?: string) =>
      push('success', title, description),
    error: (title: string, description?: string) =>
      push('error', title, description),
  }
}
