import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const cartOfferMock: PublicPromotion = {
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

export const cartGiftMock: PublicPromotion = {
  ...cartOfferMock,
  id: 'gift-1',
  type: 'GIFT',
  minOrderValue: 80,
  giftProduct: { id: 'product-coke', name: 'Coca-Cola Lata', price: 6.5 },
}
