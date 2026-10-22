import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

/* WHY: entre brindes abertos, o de menor mínimo é o que o cliente ganha
 * primeiro; brinde com código só vale para quem digita. */
export const pickGiftOffer = (
  promotions: PublicPromotion[] = []
): PublicPromotion | undefined =>
  promotions
    .filter(({ type, code }) => type === 'GIFT' && !code)
    .sort((first, second) => first.minOrderValue - second.minOrderValue)[0]

export const giftApplies = (
  offer: PublicPromotion | undefined,
  subtotal: number
): boolean => !!offer?.giftProduct && subtotal >= offer.minOrderValue
