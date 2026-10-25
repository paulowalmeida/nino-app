import { describe, expect, it } from 'vitest'

import { checkoutTotals } from './checkout-totals'
import { checkoutTotalsMock } from './checkout-totals.mock'

describe('checkoutTotals', () => {
  it('calculates subtotal, delivery fee, total, and delivery note', () => {
    const result = checkoutTotals({
      cartLines: checkoutTotalsMock.cartLines,
      isDelivery: true,
      zone: {
        id: 'zone-1',
        name: 'Centro',
        minRadiusKm: 0,
        maxRadiusKm: 5,
        fee: checkoutTotalsMock.deliveryFee,
      },
      estimatedMinutes: checkoutTotalsMock.estimatedMinutes,
    })

    expect(result).toEqual({
      subtotal: 25,
      deliveryFee: 5,
      deliveryDiscount: 0,
      freeDeliveryCoverage: 'none',
      promotionDiscount: 0,
      appliedDiscount: undefined,
      appliedGift: undefined,
      total: 30,
      deliveryNote: 'Chega em ~30 min',
    })
  })

  it('returns zero delivery fee and fallback note for pickup', () => {
    expect(
      checkoutTotals({
        cartLines: [],
        isDelivery: false,
        zone: undefined,
        estimatedMinutes: undefined,
      })
    ).toEqual({
      subtotal: 0,
      deliveryFee: 0,
      deliveryDiscount: 0,
      freeDeliveryCoverage: 'none',
      promotionDiscount: 0,
      appliedDiscount: undefined,
      appliedGift: undefined,
      total: 0,
      deliveryNote: 'Levamos até você',
    })
  })

  it('zeroes the delivery fee inside a free delivery campaign', () => {
    const result = checkoutTotals({
      cartLines: checkoutTotalsMock.cartLines,
      isDelivery: true,
      zone: checkoutTotalsMock.campaignZone,
      estimatedMinutes: undefined,
      freeDelivery: checkoutTotalsMock.freeDelivery,
    })

    expect(result).toMatchObject({
      deliveryFee: 5,
      deliveryDiscount: 5,
      freeDeliveryCoverage: 'applied',
      total: 25,
    })
  })

  it('charges the normal fee outside the campaign zones', () => {
    const result = checkoutTotals({
      cartLines: checkoutTotalsMock.cartLines,
      isDelivery: true,
      zone: { ...checkoutTotalsMock.campaignZone, id: 'zone-longe' },
      estimatedMinutes: undefined,
      freeDelivery: checkoutTotalsMock.freeDelivery,
    })

    expect(result).toMatchObject({
      deliveryDiscount: 0,
      freeDeliveryCoverage: 'outside-zone',
      total: 30,
    })
  })

  it('takes the largest discount off the items, on top of free delivery', () => {
    const result = checkoutTotals({
      cartLines: checkoutTotalsMock.cartLines,
      isDelivery: true,
      zone: checkoutTotalsMock.campaignZone,
      estimatedMinutes: undefined,
      freeDelivery: checkoutTotalsMock.freeDelivery,
      discountCandidates: [
        undefined,
        {
          ...checkoutTotalsMock.freeDelivery,
          id: 'ten',
          type: 'PERCENTAGE_DISCOUNT',
          value: 10,
        },
        {
          ...checkoutTotalsMock.freeDelivery,
          id: 'two',
          type: 'FIXED_DISCOUNT',
          value: 2,
        },
      ],
    })

    expect(result).toMatchObject({
      deliveryDiscount: 5,
      promotionDiscount: 2.5,
      total: 22.5,
    })
    expect(result.appliedDiscount?.id).toBe('ten')
  })

  it('adds the gift once the order reaches its minimum, without changing the total', () => {
    const gift = {
      ...checkoutTotalsMock.freeDelivery,
      id: 'gift',
      type: 'GIFT' as const,
      giftProduct: { id: 'coke', name: 'Coca-Cola Lata', price: 6.5 },
    }

    const result = checkoutTotals({
      cartLines: checkoutTotalsMock.cartLines,
      isDelivery: false,
      zone: undefined,
      estimatedMinutes: undefined,
      gift,
    })

    expect(result.appliedGift).toBe(gift)
    expect(result.total).toBe(25)
  })

  it('uses the package saving when it beats coupon and gift', () => {
    const packageOffer = {
      ...checkoutTotalsMock.freeDelivery,
      id: 'package',
      type: 'PACKAGE' as const,
      value: 20,
    }
    const packageLine = {
      id: 'package-line',
      quantity: 1,
      item: {
        id: 'package:package',
        name: 'Combo',
        price: '20',
        imageUrl: null,
        package: {
          promotionId: 'package',
          listPrice: 30,
          groups: [],
        },
      },
    }

    const result = checkoutTotals({
      cartLines: [packageLine],
      isDelivery: false,
      zone: undefined,
      estimatedMinutes: undefined,
      packageOffer,
      discountCandidates: [
        {
          ...checkoutTotalsMock.freeDelivery,
          type: 'FIXED_DISCOUNT',
          value: 5,
        },
      ],
      giftCandidates: [
        {
          ...checkoutTotalsMock.freeDelivery,
          type: 'GIFT',
          giftProduct: { id: 'coke', name: 'Coca-Cola', price: 6 },
        },
      ],
    })

    expect(result).toMatchObject({
      subtotal: 30,
      promotionDiscount: 10,
      appliedPackage: packageOffer,
      appliedDiscount: undefined,
      appliedGift: undefined,
      total: 20,
    })
  })
})
