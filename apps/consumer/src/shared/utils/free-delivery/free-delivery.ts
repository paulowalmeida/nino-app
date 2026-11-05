import type { FreeDeliveryCoverage } from '@custom_types/promotion/free-delivery-coverage.type'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

/* WHY: campanha com código só vale para quem digita, e o app ainda não tem
 * onde digitar; entre as abertas, a de menor mínimo é a que o cliente ganha
 * primeiro. */
const coversZone = (offer: PublicPromotion, zoneId: string): boolean =>
  offer.allDeliveryZones || offer.deliveryZoneIds.includes(zoneId)

export const openFreeDeliveryOffers = (
  promotions: PublicPromotion[] = []
): PublicPromotion[] =>
  promotions.filter(({ type, code }) => type === 'FREE_DELIVERY' && !code)

export const pickFreeDeliveryOffer = (
  promotions: PublicPromotion[] = [],
  zoneId?: string
): PublicPromotion | undefined => {
  const open = openFreeDeliveryOffers(promotions)
  const covering = zoneId
    ? open.filter((offer) => coversZone(offer, zoneId))
    : []
  return (covering.length ? covering : open).sort(
    (first, second) => first.minOrderValue - second.minOrderValue
  )[0]
}

export const freeDeliveryGap = (
  offer: PublicPromotion | undefined,
  subtotal: number
): number => (offer ? Math.max(0, offer.minOrderValue - subtotal) : 0)

export const freeDeliveryCoverage = (
  offer: PublicPromotion | undefined,
  {
    isDelivery,
    zoneId,
    subtotal,
    deliveryFee,
  }: {
    isDelivery: boolean
    zoneId: string | undefined
    subtotal: number
    deliveryFee: number
  }
): FreeDeliveryCoverage => {
  if (!offer || !isDelivery || deliveryFee <= 0) return 'none'
  if (!offer.allDeliveryZones && !offer.deliveryZoneIds.includes(zoneId ?? ''))
    return 'outside-zone'
  return freeDeliveryGap(offer, subtotal) > 0 ? 'below-minimum' : 'applied'
}
