import { describe, expect, it } from 'vitest'

import { toCounterSaleRequest } from './counter-sale.adapter'
import { counterSaleInputMock } from './counter-sale.adapter.mock'

describe(toCounterSaleRequest.name, () => {
  it('converts a counter sale to an order request', () => {
    expect(toCounterSaleRequest(counterSaleInputMock)).toEqual({
      channel: 'COUNTER',
      paymentMethod: 'CASH',
      cashReceived: true,
      guestName: 'Ana',
      changeFor: undefined,
      items: [
        {
          productId: 'item-1',
          quantity: 2,
          unitPrice: 10,
          modifiers: undefined,
        },
      ],
    })
  })

  it('sends the product modifier selections', () => {
    expect(
      toCounterSaleRequest({
        ...counterSaleInputMock,
        lines: [
          {
            ...counterSaleInputMock.lines[0],
            modifiers: [
              {
                optionId: 'option-1',
                name: 'Ao ponto',
                unitPrice: '0',
                quantity: 1,
              },
            ],
          },
        ],
      }).items[0]
    ).toMatchObject({
      modifiers: [{ optionId: 'option-1', quantity: 1 }],
    })
  })

  it('sends the chosen channel', () => {
    expect(
      toCounterSaleRequest({ ...counterSaleInputMock, channel: 'PICKUP' })
    ).toMatchObject({ channel: 'PICKUP' })
  })

  it.each(['DELIVERY', 'PICKUP'] as const)(
    'sends recipient fields for %s',
    (channel) => {
      expect(
        toCounterSaleRequest({
          ...counterSaleInputMock,
          channel,
          recipient: {
            name: 'Bia',
            phone: '91999990000',
            street: 'Rua A',
            number: '12',
            complement: 'Apto 2',
            neighborhood: 'Centro',
            city: 'Ananindeua',
            state: 'PA',
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
        guestCity: 'Ananindeua',
        guestState: 'PA',
        deliveryZoneId: channel === 'DELIVERY' ? 'zone-1' : undefined,
      })
    }
  )

  it('omits empty recipient fields', () => {
    expect(
      toCounterSaleRequest({
        ...counterSaleInputMock,
        consumerName: '',
      })
    ).toMatchObject({
      guestName: undefined,
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
