import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const autoFreeDeliveryMock: PublicPromotion = {
  id: 'auto-free',
  name: 'Frete grátis',
  type: 'FREE_DELIVERY',
  value: 0,
  code: null,
  minOrderValue: 60,
  maxDiscount: null,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: null,
}

export const autoDiscountMock: PublicPromotion = {
  ...autoFreeDeliveryMock,
  id: 'auto-discount',
  type: 'PERCENTAGE_DISCOUNT',
  value: 10,
}

export const freeDeliveryCouponMock: PublicPromotion = {
  ...autoFreeDeliveryMock,
  id: 'coupon-free',
  code: 'FRETEJA',
  minOrderValue: 0,
}
