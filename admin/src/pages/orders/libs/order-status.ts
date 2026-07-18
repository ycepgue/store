// Единый источник правды по статусам заказа: подписи, цвета, порядок.
// Используется и в клиентских «Мои заказы», и в админ-панели.

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderStatusMeta {
  label: string
  // Классы Tailwind для «залитого» цветного бейджа (со светлой/тёмной темой).
  badgeClass: string
  // Цвет точки-индикатора.
  dotClass: string
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  pending: {
    label: 'В обработке',
    badgeClass:
      'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    dotClass: 'bg-amber-500',
  },
  confirmed: {
    label: 'Подтверждён',
    badgeClass:
      'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    dotClass: 'bg-blue-500',
  },
  shipped: {
    label: 'В доставке',
    badgeClass:
      'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
    dotClass: 'bg-violet-500',
  },
  delivered: {
    label: 'Доставлен',
    badgeClass:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    dotClass: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Отменён',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    dotClass: 'bg-red-500',
  },
}

// Порядок статусов для прогресса заказа (отменённый — вне цепочки).
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
]

const FALLBACK: OrderStatusMeta = {
  label: 'Неизвестно',
  badgeClass: 'bg-muted text-muted-foreground dark:bg-muted/40',
  dotClass: 'bg-muted-foreground',
}

export function orderStatusMeta(status: string): OrderStatusMeta {
  return (
    ORDER_STATUS_META[status as OrderStatus] ?? { ...FALLBACK, label: status }
  )
}
