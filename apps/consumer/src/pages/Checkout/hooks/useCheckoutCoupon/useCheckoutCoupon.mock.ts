import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const couponUnitIdMock = 'unit-1'

export const typedCouponMock: PublicPromotion = {
  id: 'coupon-1',
  name: 'R$ 10,00 de desconto',
  type: 'FIXED_DISCOUNT',
  value: 10,
  code: 'VOLTA10',
  minOrderValue: 0,
  maxDiscount: null,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: null,
}
