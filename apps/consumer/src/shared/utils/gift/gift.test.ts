import { describe, expect, it } from 'vitest'

import { giftApplies, pickGiftOffer } from './gift'
import { giftOfferMock } from './gift.mock'

describe('gift', () => {
  it('offers the open gift with the lowest minimum', () => {
    expect(
      pickGiftOffer([
        { ...giftOfferMock, id: 'coded', code: 'VIP', minOrderValue: 0 },
        { ...giftOfferMock, id: 'gift-90', minOrderValue: 90 },
        giftOfferMock,
      ])?.id
    ).toBe('gift-60')
  })

  it('gives the gift once the order reaches the minimum', () => {
    expect(giftApplies(giftOfferMock, 59.9)).toBe(false)
    expect(giftApplies(giftOfferMock, 60)).toBe(true)
    expect(giftApplies(undefined, 100)).toBe(false)
  })
})
