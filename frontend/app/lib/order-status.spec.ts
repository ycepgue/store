import { describe, it, expect } from 'vitest'
import {
  orderStatusMeta,
  ORDER_STATUS_META,
  ORDER_STATUS_FLOW,
} from './order-status'

describe('orderStatusMeta', () => {
  it('возвращает метаданные для известного статуса', () => {
    expect(orderStatusMeta('delivered').label).toBe('Доставлен')
    expect(orderStatusMeta('delivered').badgeClass).toContain('emerald')
  })

  it('для неизвестного статуса отдаёт fallback с самим статусом как подписью', () => {
    const meta = orderStatusMeta('weird-status')
    expect(meta.label).toBe('weird-status')
    expect(meta.badgeClass).toContain('muted')
  })

  it('покрывает все статусы из flow', () => {
    for (const status of ORDER_STATUS_FLOW) {
      expect(ORDER_STATUS_META[status]).toBeDefined()
    }
  })

  it('flow не содержит отменённый статус', () => {
    expect(ORDER_STATUS_FLOW).not.toContain('cancelled')
    expect(ORDER_STATUS_FLOW).toEqual([
      'pending',
      'confirmed',
      'shipped',
      'delivered',
    ])
  })
})
