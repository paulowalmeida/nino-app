import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const giftOfferMock: PublicPromotion = {
  id: 'gift-60',
  name: 'Ganhe Coca-Cola Lata',
  type: 'GIFT',
  value: 0,
  code: null,
  minOrderValue: 60,
  maxDiscount: null,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
  giftProduct: { id: 'product-coke', name: 'Coca-Cola Lata', price: 6.5 },
}
