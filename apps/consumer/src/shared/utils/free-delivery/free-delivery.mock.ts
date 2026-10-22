import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const freeDeliveryNowMock = new Date('2026-10-22T15:00:00.000Z')

export const openOfferMock: PublicPromotion = {
  id: 'open',
  name: 'Frete grátis acima de R$ 60,00',
  type: 'FREE_DELIVERY',
  value: 0,
  code: null,
  minOrderValue: 60,
  endsAt: '2026-10-25T23:00:00.000Z',
  allDeliveryZones: false,
  deliveryZoneIds: ['zone-centro'],
}

export const visiblePromotionsMock: PublicPromotion[] = [
  { ...openOfferMock, id: 'coded', code: 'VIP', minOrderValue: 0 },
  { ...openOfferMock, id: 'discount', type: 'FIXED_DISCOUNT', minOrderValue: 0 },
  { ...openOfferMock, id: 'pricier', minOrderValue: 90 },
  openOfferMock,
]
