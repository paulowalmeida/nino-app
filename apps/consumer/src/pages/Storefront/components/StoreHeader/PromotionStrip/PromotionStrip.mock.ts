import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const stripFreeDeliveryMock: PublicPromotion = {
  id: 'promotion-1',
  name: 'Frete grátis acima de R$ 60,00',
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

export const stripDiscountMock: PublicPromotion = {
  ...stripFreeDeliveryMock,
  id: 'promotion-2',
  type: 'PERCENTAGE_DISCOUNT',
  value: 10,
  minOrderValue: 50,
  maxDiscount: 15,
}
