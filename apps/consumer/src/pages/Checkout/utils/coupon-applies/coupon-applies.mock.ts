import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const couponAppliesMock: PublicPromotion = {
  id: 'coupon',
  name: 'Cupom',
  type: 'FIXED_DISCOUNT',
  value: 10,
  code: 'VOLTA10',
  minOrderValue: 50,
  maxDiscount: null,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: null,
}
