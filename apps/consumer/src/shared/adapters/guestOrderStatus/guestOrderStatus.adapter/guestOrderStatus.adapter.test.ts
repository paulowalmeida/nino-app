import { describe, expect, it } from 'vitest'

import { guestOrderStatus } from './guestOrderStatus.adapter'
import { guestOrderStatusMock } from './guestOrderStatus.adapter.mock'

describe('guestOrderStatus', () => {
  it('keeps the public timeline', () => {
    expect(guestOrderStatus(guestOrderStatusMock.response)).toMatchObject({
      id: 'order-1',
      timeline: [{ status: 'PREPARING', at: '2026-08-29T19:10:00.000Z' }],
    })
  })

  it('fills details from the order fields, dropping cancelled items', () => {
    const order = guestOrderStatus({
      ...guestOrderStatusMock.response,
      ...guestOrderStatusMock.withDetails,
    })

    expect(order.details?.items).toHaveLength(1)
    expect(order.details?.items[0]).toMatchObject({
      name: 'Pizza',
      modifiers: [{ name: 'Borda' }],
    })
    expect(order.details?.deliveryAddress?.street).toBe('Rua A')
  })

  it('has no details when the API does not send them', () => {
    expect(
      guestOrderStatus(guestOrderStatusMock.response).details
    ).toBeUndefined()
  })
})
