import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

export const freeDeliveryMock = {
  id: 'free-1',
  type: 'FREE_DELIVERY',
  value: 0,
  minOrderValue: 20,
  allDeliveryZones: true,
} as unknown as PublicPromotion

export const fixedDiscountMock = {
  id: 'fixed-1',
  type: 'FIXED_DISCOUNT',
  value: 10,
  minOrderValue: 0,
  allDeliveryZones: true,
} as unknown as PublicPromotion
