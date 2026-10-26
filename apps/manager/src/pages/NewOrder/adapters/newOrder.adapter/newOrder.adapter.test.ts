import { describe, expect, it } from 'vitest'

import { toCreateOrderRequest } from './newOrder.adapter'
import {
  anonymousDeliverySubmissionMock,
  counterSubmissionMock,
  deliverySubmissionMock,
} from './newOrder.adapter.mock'

describe('toCreateOrderRequest', () => {
  it('sends the ticket items with a numeric unit price', () => {
    const request = toCreateOrderRequest(counterSubmissionMock)

    expect(request.items).toEqual([
      { productId: 'product-1', quantity: 2, unitPrice: 7.5 },
    ])
    expect(request.channel).toBe('COUNTER')
    expect(request.paymentMethod).toBe('CASH')
  })

  it('drops empty optional fields instead of sending blanks', () => {
    const request = toCreateOrderRequest(counterSubmissionMock)

    expect(request.notes).toBeUndefined()
    expect(request).not.toHaveProperty('deliveryZoneId')
    expect(request).not.toHaveProperty('guestStreet')
  })

  it('normalizes the phone to E.164', () => {
    expect(toCreateOrderRequest(counterSubmissionMock).guestPhone).toBe(
      '+5511988887777'
    )
  })

  it('carries the address only when the order is delivered', () => {
    const request = toCreateOrderRequest(deliverySubmissionMock)

    expect(request.deliveryZoneId).toBe('zone-1')
    expect(request.guestStreet).toBe('Rua Olimpíadas')
    expect(request.guestNumber).toBe('55')
    expect(request.guestComplement).toBe('apto 22')
    expect(request.guestNeighborhood).toBe('Vila Olímpia')
    expect(request.notes).toBe('Sem cebola')
  })

  it('omits every empty field of an unnamed delivery', () => {
    const request = toCreateOrderRequest(anonymousDeliverySubmissionMock)

    expect(request.guestName).toBeUndefined()
    expect(request.guestPhone).toBeUndefined()
    expect(request.guestNumber).toBeUndefined()
    expect(request.guestComplement).toBeUndefined()
    expect(request.guestNeighborhood).toBeUndefined()
    expect(request.guestStreet).toBe('Rua Sem Nome')
    expect(request.deliveryZoneId).toBe('zone-3')
  })
})
