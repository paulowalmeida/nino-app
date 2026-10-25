import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { brl } from '@utils/money/money'

const DAY_MS = 24 * 60 * 60 * 1000
const shortDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})
const weekdayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

const benefitOf = ({
  type,
  value,
  maxDiscount,
  giftProduct,
}: PublicPromotion): string => {
  if (type === 'FREE_DELIVERY') return 'Frete grátis'
  if (type === 'GIFT') return `Ganhe ${giftProduct?.name ?? 'um brinde'}`
  if (type === 'PACKAGE') return `Promoção por ${brl(value)}`
  if (type === 'FIXED_DISCOUNT') return `${brl(value)} de desconto`
  return maxDiscount
    ? `${value}% de desconto (até ${brl(maxDiscount)})`
    : `${value}% de desconto`
}

const untilOf = (endsAt: string, now: Date): string => {
  const end = new Date(endsAt)
  const daysLeft = (end.getTime() - now.getTime()) / DAY_MS
  return daysLeft > 0 && daysLeft < 7
    ? weekdayName.format(end)
    : shortDate.format(end)
}

export const promotionLabel = (
  promotion: PublicPromotion,
  now: Date = new Date()
): string => {
  const benefit = benefitOf(promotion)
  const condition =
    promotion.minOrderValue > 0
      ? `${benefit} acima de ${brl(promotion.minOrderValue)}`
      : `${benefit} em qualquer pedido`
  return promotion.endsAt
    ? `${condition} · até ${untilOf(promotion.endsAt, now)}`
    : condition
}
