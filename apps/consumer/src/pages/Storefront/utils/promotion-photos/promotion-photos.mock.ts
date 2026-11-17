import type { MenuSection } from '@custom_types/menu/menu-section'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

const item = (id: string, url: string | null) => ({
  id,
  images: url ? [{ id: `${id}-img`, url, isPrimary: true }] : [],
  fallbackUrl: null,
})

export const photoSectionsMock = [
  {
    id: 'cat-1',
    items: [
      item('no-photo', null),
      item('burger', 'https://cdn.example/burger.png'),
      item('fries', 'https://cdn.example/fries.png'),
      item('soda', 'https://cdn.example/soda.png'),
    ],
  },
] as unknown as MenuSection[]

export const anyOrderPromotionMock = {
  id: 'free-1',
  type: 'FREE_DELIVERY',
  eligibleProductIds: null,
  giftProduct: null,
} as unknown as PublicPromotion

export const eligibleItemsPromotionMock = {
  ...anyOrderPromotionMock,
  type: 'FIXED_DISCOUNT',
  eligibleProductIds: ['soda'],
} as unknown as PublicPromotion
