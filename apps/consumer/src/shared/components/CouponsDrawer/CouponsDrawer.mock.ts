import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const drawerAvailableMock: PublicPromotion = {
  id: 'coupon-available',
  name: '10% de desconto',
  type: 'PERCENTAGE_DISCOUNT',
  value: 10,
  code: 'VOLTA10',
  minOrderValue: 0,
  maxDiscount: null,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: null,
}

export const drawerBlockedMock: PublicPromotion = {
  ...drawerAvailableMock,
  id: 'coupon-blocked',
  code: null,
  name: 'Desconto no X-Tudo',
  type: 'FIXED_DISCOUNT',
  value: 10,
  minOrderValue: 30,
}
