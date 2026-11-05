import { describe, expect, it } from 'vitest'

import {
  freeDeliveryCoverage,
  freeDeliveryGap,
  pickFreeDeliveryOffer,
} from './free-delivery'
import {
  openOfferMock,
  visiblePromotionsMock,
  zoneOffersMock,
} from './free-delivery.mock'

const deliveryOrder = {
  isDelivery: true,
  zoneId: 'zone-centro',
  subtotal: 70,
  deliveryFee: 7,
}

describe('free-delivery', () => {
  it('offers the open free delivery with the lowest minimum, never a coded one', () => {
    expect(pickFreeDeliveryOffer(visiblePromotionsMock)?.id).toBe('open')
    expect(pickFreeDeliveryOffer(undefined)).toBeUndefined()
  })

  it('picks the offer that covers the order zone, not just the cheapest minimum', () => {
    expect(pickFreeDeliveryOffer(zoneOffersMock, 'zone-2km')?.id).toBe(
      'up-to-2km'
    )
    expect(pickFreeDeliveryOffer(zoneOffersMock, 'zone-1km')?.id).toBe(
      'up-to-1km'
    )
  })

  it('falls back to the cheapest minimum when no offer covers the zone', () => {
    expect(pickFreeDeliveryOffer(zoneOffersMock, 'zone-5km')?.id).toBe(
      'up-to-1km'
    )
    expect(pickFreeDeliveryOffer(zoneOffersMock)?.id).toBe('up-to-1km')
  })

  it('says how much is missing to reach the minimum', () => {
    expect(freeDeliveryGap(openOfferMock, 47.6)).toBeCloseTo(12.4)
    expect(freeDeliveryGap(openOfferMock, 80)).toBe(0)
    expect(freeDeliveryGap(undefined, 10)).toBe(0)
  })

  it('applies inside a campaign zone once the minimum is reached', () => {
    expect(freeDeliveryCoverage(openOfferMock, deliveryOrder)).toBe('applied')
    expect(
      freeDeliveryCoverage(openOfferMock, { ...deliveryOrder, subtotal: 50 })
    ).toBe('below-minimum')
  })

  it('does not apply outside the campaign zones', () => {
    expect(
      freeDeliveryCoverage(openOfferMock, {
        ...deliveryOrder,
        zoneId: 'zone-longe',
      })
    ).toBe('outside-zone')
  })

  it('shows nothing for pickup', () => {
    expect(
      freeDeliveryCoverage(openOfferMock, {
        ...deliveryOrder,
        isDelivery: false,
        deliveryFee: 0,
      })
    ).toBe('none')
  })
})
