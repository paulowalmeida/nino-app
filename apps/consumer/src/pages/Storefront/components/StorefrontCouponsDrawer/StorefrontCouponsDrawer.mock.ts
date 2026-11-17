import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const storefrontAvailableMock: PublicPromotion = {
  id: 'promo-available',
  name: 'Frete grátis',
  type: 'FREE_DELIVERY',
  value: 0,
  code: null,
  minOrderValue: 20,
  maxDiscount: null,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: null,
}

export const storefrontBlockedMock: PublicPromotion = {
  ...storefrontAvailableMock,
  id: 'promo-blocked',
  name: 'Desconto no X-Tudo',
  type: 'FIXED_DISCOUNT',
  value: 10,
  minOrderValue: 50,
}
