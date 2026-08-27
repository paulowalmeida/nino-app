import { describe, expect, it } from 'vitest'

import { demoOrder, demoTimeline } from './welcomeDemoOrder'
import { welcomeDemoOrderMock } from './welcomeDemoOrder.mock'

describe('demoOrder', () => {
  it('builds a believable order at the requested status and age', () => {
    const order = demoOrder(
      welcomeDemoOrderMock.status,
      welcomeDemoOrderMock.elapsedMinutes
    )

    expect(order.status).toBe(welcomeDemoOrderMock.status)
    expect(order.items).toHaveLength(2)
    expect(order.totalAmount).toBe('56.80')
  })
})

describe('demoTimeline', () => {
  it('walks the order through pending, preparing, and out for delivery', () => {
    const timeline = demoTimeline()

    expect(timeline.map((entry) => entry.status)).toEqual([
      'PENDING',
      'PREPARING',
      'OUT_FOR_DELIVERY',
    ])
  })
})
