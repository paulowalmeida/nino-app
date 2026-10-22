import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const cartOfferMock: PublicPromotion = {
  id: 'promotion-1',
  name: 'Frete grátis acima de R$ 60,00',
  type: 'FREE_DELIVERY',
  value: 0,
  code: null,
  minOrderValue: 60,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
}
