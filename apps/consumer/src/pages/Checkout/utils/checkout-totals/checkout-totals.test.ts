import { describe, expect, it } from 'vitest'

import { checkoutTotals } from './checkout-totals'
import { checkoutTotalsMock } from './checkout-totals.mock'

describe('checkoutTotals', () => {
  it('calculates subtotal, delivery fee, total, and delivery note', () => {
    const result = checkoutTotals({
      cartLines: checkoutTotalsMock.cartLines,
      isDelivery: true,
      zone: {
        id: 'zone-1', name: 'Centro', minRadiusKm: 0,
        maxRadiusKm: 5, fee: checkoutTotalsMock.deliveryFee,
      },
      estimatedMinutes: checkoutTotalsMock.estimatedMinutes,
    })

    expect(result).toEqual({
      subtotal: 25,
      deliveryFee: 5,
      total: 30,
      deliveryNote: 'Chega em ~30 min',
    })
  })

  it('returns zero delivery fee and fallback note for pickup', () => {
    expect(checkoutTotals({
      cartLines: [], isDelivery: false, zone: undefined,
      estimatedMinutes: undefined,
    })).toEqual({
      subtotal: 0, deliveryFee: 0, total: 0,
      deliveryNote: 'Levamos até você',
    })
  })
})
