import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const suggestedCouponMock: PublicPromotion = {
  id: 'coupon-1',
  name: '10% de desconto',
  type: 'PERCENTAGE_DISCOUNT',
  value: 10,
  code: 'VOLTA10',
  minOrderValue: 50,
  maxDiscount: null,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: null,
}
