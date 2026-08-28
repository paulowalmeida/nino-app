import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Order } from '@shared/types/order/order'

import { countLateOrders } from './late-orders'
import { lateOrdersMock } from './late-orders.mock'

const NOW = new Date('2026-08-01T12:00:00.000Z')

const orderAgedBy = (minutes: number, id: string): Order =>
  ({
    id,
    createdAt: new Date(NOW.getTime() - minutes * 60_000).toISOString(),
    acceptedAt: null,
  }) as Order

describe('countLateOrders', () => {
  beforeEach(() => vi.setSystemTime(NOW))
  afterEach(() => vi.useRealTimers())

  it('counts only the orders past the deadline', () => {
    const { lateMinutes, onTimeMinutes } = lateOrdersMock

    expect(
      countLateOrders([
        orderAgedBy(lateMinutes, 'late'),
        orderAgedBy(onTimeMinutes, 'on-time'),
      ])
    ).toBe(1)
  })

  it('counts nothing on an empty board', () => {
    expect(countLateOrders([])).toBe(0)
  })
})
