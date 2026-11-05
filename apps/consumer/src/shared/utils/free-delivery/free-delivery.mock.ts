import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const openOfferMock: PublicPromotion = {
  id: 'open',
  name: 'Frete grátis acima de R$ 60,00',
  type: 'FREE_DELIVERY',
  value: 0,
  code: null,
  minOrderValue: 60,
  maxDiscount: null,
  endsAt: '2026-10-25T23:00:00.000Z',
  allDeliveryZones: false,
  deliveryZoneIds: ['zone-centro'],
  giftProduct: null,
}

export const visiblePromotionsMock: PublicPromotion[] = [
  { ...openOfferMock, id: 'coded', code: 'VIP', minOrderValue: 0 },
  {
    ...openOfferMock,
    id: 'discount',
    type: 'FIXED_DISCOUNT',
    minOrderValue: 0,
  },
  { ...openOfferMock, id: 'pricier', minOrderValue: 90 },
  openOfferMock,
]

export const zoneOffersMock: PublicPromotion[] = [
  {
    ...openOfferMock,
    id: 'up-to-1km',
    minOrderValue: 25,
    allDeliveryZones: false,
    deliveryZoneIds: ['zone-1km'],
  },
  {
    ...openOfferMock,
    id: 'up-to-2km',
    minOrderValue: 40,
    allDeliveryZones: false,
    deliveryZoneIds: ['zone-2km'],
  },
]
