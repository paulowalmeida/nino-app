import { describe, expect, it } from 'vitest'

import { consumerOrderRequest } from './consumerOrderRequest.adapter'
import { consumerOrderRequestAdapterMock } from './consumerOrderRequest.adapter.mock'

describe('consumerOrderRequest', () => {
  it('uses the saved address and omits guest identity fields', () => {
    const request = consumerOrderRequest(
      {
        ...consumerOrderRequestAdapterMock.values,
        channel: 'DELIVERY',
        deliveryAddressId: consumerOrderRequestAdapterMock.deliveryAddressId,
      },
      consumerOrderRequestAdapterMock.store,
      consumerOrderRequestAdapterMock.cartLines
    )

    expect(request.deliveryAddressId).toBe(
      consumerOrderRequestAdapterMock.deliveryAddressId
    )
    expect(request).not.toHaveProperty('guestName')
    expect(request).not.toHaveProperty('guestPhone')
  })
})
