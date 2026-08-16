import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Order } from '@custom_types/order/order'
import { tallyToday } from '@utils/day-tally'

import { baseOrder } from './day-tally.mock'

const ZONE = 'America/Fortaleza'

describe(tallyToday.name, () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-04T12:00:00-03:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sums today paid orders into count, revenue and average', () => {
    // Arrange
    const orders: Order[] = [
      { ...baseOrder, id: 'order-0001', totalAmount: '10.00' },
      { ...baseOrder, id: 'order-0002', totalAmount: '20.00' },
    ]

    // Act
    const tally = tallyToday(orders, ZONE)

    // Assert
    expect(tally).toMatchObject({ orders: 2, revenue: 30, average: 15 })
  })

  it('excludes cancelled and yesterday orders from the tally', () => {
    // Arrange
    const orders: Order[] = [
      { ...baseOrder, id: 'order-0001', totalAmount: '10.00' },
      {
        ...baseOrder,
        id: 'order-0002',
        totalAmount: '90.00',
        status: 'CANCELLED',
      },
      {
        ...baseOrder,
        id: 'order-0003',
        totalAmount: '90.00',
        createdAt: '2026-08-03T15:00:00.000Z',
      },
    ]

    // Act
    const tally = tallyToday(orders, ZONE)

    // Assert
    expect(tally).toMatchObject({ orders: 1, revenue: 10, average: 10 })
  })

  it('returns a zeroed tally with no orders today', () => {
    // Act
    const tally = tallyToday([], ZONE)

    // Assert
    expect(tally).toEqual({
      orders: 0,
      revenue: 0,
      average: 0,
      byPaymentMethod: [],
    })
  })

  it('groups revenue by payment method, highest first', () => {
    // Arrange
    const orders: Order[] = [
      {
        ...baseOrder,
        id: 'order-0001',
        totalAmount: '10.00',
        paymentMethod: 'PIX',
      },
      {
        ...baseOrder,
        id: 'order-0002',
        totalAmount: '20.00',
        paymentMethod: 'CASH',
      },
      {
        ...baseOrder,
        id: 'order-0003',
        totalAmount: '5.00',
        paymentMethod: 'CASH',
      },
    ]

    // Act
    const { byPaymentMethod } = tallyToday(orders, ZONE)

    // Assert
    expect(byPaymentMethod).toEqual([
      { method: 'CASH', amount: 25 },
      { method: 'PIX_ONLINE', amount: 10 },
    ])
  })
})
