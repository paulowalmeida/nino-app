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
})
