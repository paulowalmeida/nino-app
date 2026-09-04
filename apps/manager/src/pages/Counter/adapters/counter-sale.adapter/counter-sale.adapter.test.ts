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
      changeFor: undefined,
      items: [{ productId: 'item-1', quantity: 2, unitPrice: 10 }],
    })
  })

  it('sends the chosen channel', () => {
    expect(
      toCounterSaleRequest({ ...counterSaleInputMock, channel: 'PICKUP' })
    ).toMatchObject({ channel: 'PICKUP' })
  })

  it('keeps the table number out of a channel that has no tables', () => {
    expect(
      toCounterSaleRequest({ ...counterSaleInputMock, channel: 'DELIVERY' })
    ).toMatchObject({ tableNumber: undefined })
  })

  it('translates delivery recipient data and zone', () => {
    expect(
      toCounterSaleRequest({
        ...counterSaleInputMock,
        channel: 'DELIVERY',
        recipient: {
          name: 'Bia',
          phone: '91999990000',
          street: 'Rua A',
          number: '12',
          complement: 'Apto 2',
          neighborhood: 'Centro',
          zoneId: 'zone-1',
        },
      })
    ).toMatchObject({
      guestName: 'Bia',
      guestPhone: '91999990000',
      guestStreet: 'Rua A',
      guestNumber: '12',
      guestComplement: 'Apto 2',
      guestNeighborhood: 'Centro',
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

  it('sends the amount received for cash payments', () => {
    expect(
      toCounterSaleRequest({ ...counterSaleInputMock, changeFor: '25,50' })
    ).toMatchObject({ changeFor: 25.5 })
  })

  it('reads the thousands separator the mask writes', () => {
    expect(
      toCounterSaleRequest({ ...counterSaleInputMock, changeFor: '1.250,00' })
    ).toMatchObject({ changeFor: 1250 })
  })

  it('sends no change for an exact cash payment', () => {
    expect(
      toCounterSaleRequest({ ...counterSaleInputMock, changeFor: '' })
    ).toMatchObject({ changeFor: undefined })
  })
})
