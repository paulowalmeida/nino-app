import type { FreeDeliveryCoverage } from '@custom_types/promotion/free-delivery-coverage.type'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { brl } from '@utils/money/money'

const DAY_MS = 24 * 60 * 60 * 1000
const shortDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})
const weekdayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

/* WHY: campanha com código só vale para quem digita, e o app ainda não tem
 * onde digitar; entre as abertas, a de menor mínimo é a que o cliente ganha
 * primeiro. */
export const pickFreeDeliveryOffer = (
  promotions: PublicPromotion[] = []
): PublicPromotion | undefined =>
  promotions
    .filter(({ type, code }) => type === 'FREE_DELIVERY' && !code)
    .sort((first, second) => first.minOrderValue - second.minOrderValue)[0]

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

export const freeDeliveryLabel = (
  { minOrderValue, endsAt }: PublicPromotion,
  now: Date = new Date()
): string => {
  const condition =
    minOrderValue > 0
      ? `Frete grátis acima de ${brl(minOrderValue)}`
      : 'Frete grátis em qualquer pedido'
  if (!endsAt) return condition
  const end = new Date(endsAt)
  const daysLeft = (end.getTime() - now.getTime()) / DAY_MS
  const until =
    daysLeft > 0 && daysLeft < 7
      ? weekdayName.format(end)
      : shortDate.format(end)
  return `${condition} · até ${until}`
}
