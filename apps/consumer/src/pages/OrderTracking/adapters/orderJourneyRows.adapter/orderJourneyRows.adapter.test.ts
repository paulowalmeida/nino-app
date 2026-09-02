import { describe, expect, it } from 'vitest'

import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'

import { orderJourneyRows } from './orderJourneyRows.adapter'
import { orderJourneyRowsMock } from './orderJourneyRows.adapter.mock'

describe('orderJourneyRows', () => {
  it('returns no future rows for a cancelled order without history', () => {
    expect(orderJourneyRows(orderJourneyRowsMock.order as never)).toEqual([])
  })

  it('keeps completed history rows for a cancelled order', () => {
    const order = {
      ...orderJourneyRowsMock.order,
      timeline: [
        { status: 'PENDING', at: '2026-08-29T19:01:00.000Z' },
        { status: 'CANCELLED', at: '2026-08-29T19:10:00.000Z' },
      ],
    }

    expect(orderJourneyRows(order as never).map((row) => row.state)).toEqual([
      'done',
      'final',
    ])
  })

  it('builds completed, current, and future journey rows', () => {
    const order: GuestOrderStatus = {
      id: 'order-1',
      orderNumber: 42,
      status: 'PREPARING',
      estimatedDeliveryAt: null,
      createdAt: '2026-08-29T19:00:00.000Z',
      timeline: [
        { status: 'PENDING', at: '2026-08-29T19:01:00.000Z' },
        { status: 'PREPARING', at: '2026-08-29T19:10:00.000Z' },
      ],
    }

    expect(orderJourneyRows(order).map((row) => row.state)).toEqual([
      'done',
      'done',
      'current',
      'ahead',
      'ahead',
    ])
  })

  it('falls back to recorded history for an unknown journey status', () => {
    const order = {
      ...orderJourneyRowsMock.order,
      status: 'UNKNOWN' as never,
      timeline: [{ status: 'PENDING', at: '2026-08-29T19:01:00.000Z' }],
    }

    expect(orderJourneyRows(order as never)).toEqual([
      { status: 'PENDING', at: '2026-08-29T19:01:00.000Z', state: 'current' },
    ])
  })

  it('marks the current terminal journey row as final', () => {
    const order = {
      ...orderJourneyRowsMock.order,
      status: 'DELIVERED',
      timeline: [{ status: 'DELIVERED', at: '2026-08-29T19:01:00.000Z' }],
    }

    expect(orderJourneyRows(order as never).at(-1)?.state).toBe('final')
  })
})
