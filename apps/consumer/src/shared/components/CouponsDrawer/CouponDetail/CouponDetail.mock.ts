import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const detailPromotionMock: PublicPromotion = {
  id: 'coupon-1',
  name: 'Desconto no X-Tudo',
  type: 'FIXED_DISCOUNT',
  value: 10,
  code: 'XTUDO10',
  minOrderValue: 30,
  maxDiscount: null,
  endsAt: '2099-12-31T12:00:00.000Z',
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: null,
  eligibleProductIds: ['x-tudo'],
  eligibleProductName: 'X-Tudo',
  paymentMethods: ['PIX'],
  firstOrderOnly: true,
}
