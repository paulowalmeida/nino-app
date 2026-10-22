import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const labelNowMock = new Date('2026-10-22T15:00:00.000Z')

export const labelOfferMock: PublicPromotion = {
  id: 'promotion-1',
  name: 'Frete grátis acima de R$ 60,00',
  type: 'FREE_DELIVERY',
  value: 0,
  code: null,
  minOrderValue: 60,
  maxDiscount: null,
  endsAt: '2026-10-25T23:00:00.000Z',
  allDeliveryZones: true,
  deliveryZoneIds: [],
}
