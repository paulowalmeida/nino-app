import { describe, expect, it } from 'vitest'

import { myOrderStatus } from './myOrderStatus.adapter'
import { myOrderStatusMock } from './myOrderStatus.adapter.mock'

describe('myOrderStatus', () => {
  it('maps the authenticated order history to the tracking timeline', () => {
    expect(myOrderStatus(myOrderStatusMock.response)).toMatchObject({
      id: 'order-1',
      timeline: [{ status: 'PREPARING', at: '2026-08-29T19:10:00.000Z' }],
    })
  })

  it('exposes the order details, dropping cancelled items', () => {
    const order = myOrderStatus({
      ...myOrderStatusMock.response,
      ...myOrderStatusMock.withDetails,
    })

    expect(order.details?.items).toHaveLength(1)
    expect(order.details?.items[0]).toMatchObject({
      name: 'Pizza',
      modifiers: [{ name: 'Borda' }],
    })
    expect(order.details?.paymentMethod).toBe('PIX')
  })

  it('has no details when the API does not send them', () => {
    expect(myOrderStatus(myOrderStatusMock.response).details).toBeUndefined()
  })
})
