import { describe, expect, it } from 'vitest'

import { toCounterSaleRequest } from './counter-sale.adapter'
import { counterSaleInputMock } from './counter-sale.adapter.mock'

describe(toCounterSaleRequest.name, () => {
  it('converts a counter sale to an order request', () => {
    expect(toCounterSaleRequest(counterSaleInputMock)).toEqual({
      channel: 'COUNTER',
      paymentMethod: 'CASH',
      guestName: 'Ana',
      items: [{ productId: 'item-1', quantity: 2, unitPrice: 10 }],
    })
  })

  it('omits empty recipient fields', () => {
    expect(
      toCounterSaleRequest({
        ...counterSaleInputMock,
        customerName: '',
        tableNumber: '',
      })
    ).toMatchObject({
      guestName: undefined,
    })
  })

  it('sends the amount received for cash payments', () => {
    expect(
      toCounterSaleRequest({ ...counterSaleInputMock, changeFor: '25.50' })
    ).toMatchObject({ changeFor: 25.5 })
  })
})
