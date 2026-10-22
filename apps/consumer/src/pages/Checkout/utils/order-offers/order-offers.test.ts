import { describe, expect, it } from 'vitest'

import { orderOffers } from './order-offers'
import {
  autoDiscountMock,
  autoFreeDeliveryMock,
  freeDeliveryCouponMock,
} from './order-offers.mock'

describe(orderOffers.name, () => {
  it('puts a free delivery coupon in the free delivery class', () => {
    const offers = orderOffers({
      freeDelivery: autoFreeDeliveryMock,
      discountOffers: [autoDiscountMock],
      coupon: freeDeliveryCouponMock,
      hasPromotionEnded: false,
    })

    expect(offers.freeDelivery).toBe(freeDeliveryCouponMock)
    expect(offers.discountCandidates).toEqual([undefined, autoDiscountMock])
  })

  it('drops every campaign after the API said one ended', () => {
    expect(
      orderOffers({
        freeDelivery: autoFreeDeliveryMock,
        discountOffers: [autoDiscountMock],
        coupon: undefined,
        hasPromotionEnded: true,
      })
    ).toEqual({
      freeDelivery: undefined,
      discountCandidates: [],
      gift: undefined,
    })
  })

  it('puts a gift coupon in the gift class', () => {
    const giftCoupon = {
      ...freeDeliveryCouponMock,
      id: 'gift-coupon',
      type: 'GIFT' as const,
      giftProduct: { id: 'coke', name: 'Coca-Cola Lata', price: 6.5 },
    }

    const offers = orderOffers({
      freeDelivery: autoFreeDeliveryMock,
      discountOffers: [autoDiscountMock],
      coupon: giftCoupon,
      hasPromotionEnded: false,
    })

    expect(offers.gift).toBe(giftCoupon)
    expect(offers.freeDelivery).toBe(autoFreeDeliveryMock)
    expect(offers.discountCandidates).toEqual([undefined, autoDiscountMock])
  })
})
