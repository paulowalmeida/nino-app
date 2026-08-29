import { describe, expect, it } from 'vitest'

import { guestOrderRequest } from './guestOrderRequest.adapter'
import { guestOrderRequestMock } from './guestOrderRequest.adapter.mock'

describe('guestOrderRequest', () => {
  it('omits delivery-only fields for pickup orders', () => {
    const request = guestOrderRequest(
      guestOrderRequestMock.values,
      guestOrderRequestMock.store,
      guestOrderRequestMock.cartLines
    )

    expect(request).toMatchObject({
      tenantId: 'tenant-1',
      channel: 'PICKUP',
      guestPhone: '+5511987654321',
    })
    expect(request.deliveryZoneId).toBeUndefined()
  })
})
