import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const offerUnitIdMock = 'unit-1'

export const visibleOfferMock: PublicPromotion[] = [
  {
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
  },
  {
    id: 'promotion-2',
    name: '10% de desconto',
    type: 'PERCENTAGE_DISCOUNT',
    value: 10,
    code: null,
    minOrderValue: 0,
    maxDiscount: null,
    endsAt: null,
    allDeliveryZones: true,
    deliveryZoneIds: [],
  },
  {
    id: 'promotion-3',
    name: 'R$ 10,00 de desconto',
    type: 'FIXED_DISCOUNT',
    value: 10,
    code: 'VOLTA10',
    minOrderValue: 0,
    maxDiscount: null,
    endsAt: null,
    allDeliveryZones: true,
    deliveryZoneIds: [],
  },
]
