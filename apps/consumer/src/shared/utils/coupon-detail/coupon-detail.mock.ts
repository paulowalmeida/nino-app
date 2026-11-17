import type { PublicDeliveryZone } from '@custom_types/delivery-zone/PublicDeliveryZone.type'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const couponDetailMock: PublicPromotion = {
  id: 'promo-1',
  name: 'Desconto no X-Tudo',
  type: 'FIXED_DISCOUNT',
  value: 10,
  code: 'XTUDO10',
  minOrderValue: 25,
  maxDiscount: null,
  endsAt: '2026-12-31T12:00:00.000Z',
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: null,
  eligibleProductIds: ['x-tudo'],
  eligibleProductName: 'X-Tudo',
  paymentMethods: ['CASH', 'PIX'],
  firstOrderOnly: true,
}

export const couponDetailFreeDeliveryMock: PublicPromotion = {
  ...couponDetailMock,
  id: 'promo-2',
  name: 'Frete grátis',
  type: 'FREE_DELIVERY',
  code: null,
  eligibleProductIds: null,
  eligibleProductName: null,
  paymentMethods: [],
  firstOrderOnly: false,
  allDeliveryZones: false,
  deliveryZoneIds: ['zone-2'],
}

export const couponDetailZonesMock: PublicDeliveryZone[] = [
  { id: 'zone-1', name: 'Até 1 km', minRadiusKm: 0, maxRadiusKm: 1, fee: '3' },
  {
    id: 'zone-2',
    name: 'De 1 a 2 km',
    minRadiusKm: 1,
    maxRadiusKm: 2,
    fee: '5',
  },
]

export const couponDetailNowMock = new Date('2026-12-20T12:00:00.000Z')
