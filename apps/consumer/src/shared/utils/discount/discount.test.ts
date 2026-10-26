import { describe, expect, it } from 'vitest'

import {
  acceptsPayment,
  automaticDiscounts,
  couponSuggestions,
  discountAmount,
  largestDiscount,
} from './discount'
import { fixedCouponMock, percentageOfferMock } from './discount.mock'

describe('discount', () => {
  it('applies the percentage up to the cap, only above the minimum', () => {
    expect(discountAmount(percentageOfferMock, 80)).toBe(8)
    expect(discountAmount(percentageOfferMock, 300)).toBe(15)
    expect(discountAmount(percentageOfferMock, 49.9)).toBe(0)
  })

  it('never lets a fixed discount exceed the items', () => {
    expect(discountAmount(fixedCouponMock, 10)).toBe(10)
  })

  it('keeps only the largest discount of the order', () => {
    expect(largestDiscount([fixedCouponMock, percentageOfferMock], 80)).toEqual(
      {
        promotion: fixedCouponMock,
        amount: 12,
      }
    )
    expect(
      largestDiscount([fixedCouponMock, percentageOfferMock], 300)?.promotion.id
    ).toBe('percent')
    expect(largestDiscount([undefined], 300)).toBeUndefined()
  })

  it('lists every announced discount, with or without code, as a coupon to pick', () => {
    const visible = [fixedCouponMock, percentageOfferMock]

    expect(automaticDiscounts(visible).map(({ id }) => id)).toEqual(['percent'])
    expect(couponSuggestions(visible).map(({ id }) => id)).toEqual([
      'fixed',
      'percent',
    ])
  })

  it('discounts only the campaign items while the minimum looks at the whole order', () => {
    expect(discountAmount(percentageOfferMock, 200, 50)).toBe(5)
    expect(discountAmount(fixedCouponMock, 200, 3)).toBe(3)
  })

  it('accepts a payment-restricted campaign only for that method', () => {
    const pixOnly = { ...percentageOfferMock, paymentMethods: ['PIX'] }

    expect(acceptsPayment(pixOnly, 'PIX')).toBe(true)
    expect(acceptsPayment(pixOnly, 'CASH')).toBe(false)
    expect(acceptsPayment(pixOnly, undefined)).toBe(false)
    expect(acceptsPayment(percentageOfferMock, 'CASH')).toBe(true)
  })
})
