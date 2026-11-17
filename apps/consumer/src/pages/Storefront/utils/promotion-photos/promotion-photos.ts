import type { MenuSection } from '@custom_types/menu/menu-section'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { primaryImage } from '@pages/Storefront/utils/menu-image/menu-image'

const PHOTO_LIMIT = 2

/**
 * WHY: a promoção sem imagem própria ganha cara de comida com as fotos do
 * cardápio da loja. Prefere os itens da própria oferta (brinde, itens
 * elegíveis); sem eles, usa os primeiros pratos com foto enviada.
 */
export const promotionPhotos = (
  promotion: PublicPromotion,
  sections: MenuSection[]
): string[] => {
  const items = sections.flatMap(({ items }) => items)
  const offerIds = new Set([
    ...(promotion.eligibleProductIds ?? []),
    ...(promotion.giftProduct ? [promotion.giftProduct.id] : []),
  ])
  const offerItems = items.filter(({ id }) => offerIds.has(id))
  const pool = offerItems.length
    ? offerItems
    : items.filter(({ images }) => images.length > 0)

  return pool
    .map(primaryImage)
    .filter((url): url is string => Boolean(url))
    .slice(0, PHOTO_LIMIT)
}
