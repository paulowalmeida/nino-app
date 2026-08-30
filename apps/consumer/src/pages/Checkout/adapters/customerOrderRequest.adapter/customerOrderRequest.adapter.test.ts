import { describe, expect, it } from 'vitest'

import { customerOrderRequest } from './customerOrderRequest.adapter'
import { customerOrderRequestAdapterMock } from './customerOrderRequest.adapter.mock'

describe('customerOrderRequest', () => {
  it('uses the saved address and omits guest identity fields', () => {
    const request = customerOrderRequest(
      {
        ...customerOrderRequestAdapterMock.values,
        deliveryAddressId: customerOrderRequestAdapterMock.deliveryAddressId,
      },
      customerOrderRequestAdapterMock.store,
      customerOrderRequestAdapterMock.cartLines
    )

    expect(request.deliveryAddressId).toBe(
      customerOrderRequestAdapterMock.deliveryAddressId
    )
    expect(request).not.toHaveProperty('guestName')
    expect(request).not.toHaveProperty('guestPhone')
  })
})
