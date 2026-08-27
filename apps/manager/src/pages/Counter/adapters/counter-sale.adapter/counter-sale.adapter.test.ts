import { describe, expect, it } from 'vitest'

import { toCounterSaleRequest } from './counter-sale.adapter'
import { counterSaleInputMock } from './counter-sale.adapter.mock'

describe(toCounterSaleRequest.name, () => {
  it('converts a counter sale to an order request', () => {
    expect(toCounterSaleRequest(counterSaleInputMock)).toEqual({
      channel: 'COUNTER',
      paymentMethod: 'CASH',
      guestName: 'Ana',
      tableNumber: '4',
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
      tableNumber: undefined,
    })
  })
})
