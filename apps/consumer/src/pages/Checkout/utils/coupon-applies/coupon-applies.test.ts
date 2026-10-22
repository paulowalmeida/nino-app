import { describe, expect, it } from 'vitest'

import { couponApplies } from './coupon-applies'
import { couponAppliesMock } from './coupon-applies.mock'

describe(couponApplies.name, () => {
  it('sends a discount coupon only above its minimum', () => {
    expect(
      couponApplies(couponAppliesMock, { subtotal: 49, isFreeDeliveryApplied: false })
    ).toBe(false)
    expect(
      couponApplies(couponAppliesMock, { subtotal: 50, isFreeDeliveryApplied: false })
    ).toBe(true)
  })

  it('follows the free delivery coverage and the gift minimum', () => {
    expect(
      couponApplies(
        { ...couponAppliesMock, type: 'FREE_DELIVERY' },
        { subtotal: 100, isFreeDeliveryApplied: false }
      )
    ).toBe(false)
    expect(
      couponApplies(
        {
          ...couponAppliesMock,
          type: 'GIFT',
          giftProduct: { id: 'coke', name: 'Coca-Cola Lata', price: 6.5 },
        },
        { subtotal: 50, isFreeDeliveryApplied: false }
      )
    ).toBe(true)
  })
})
