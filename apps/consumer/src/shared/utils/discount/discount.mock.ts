import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const percentageOfferMock: PublicPromotion = {
  id: 'percent',
  name: '10% de desconto acima de R$ 50,00',
  type: 'PERCENTAGE_DISCOUNT',
  value: 10,
  code: null,
  minOrderValue: 50,
  maxDiscount: 15,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: null,
}

export const fixedCouponMock: PublicPromotion = {
  ...percentageOfferMock,
  id: 'fixed',
  type: 'FIXED_DISCOUNT',
  value: 12,
  code: 'VOLTA12',
  minOrderValue: 0,
  maxDiscount: null,
}
