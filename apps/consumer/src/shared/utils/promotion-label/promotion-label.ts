import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { PROMOTION_PAYMENT_PHRASE } from '@constants/promotionPaymentPhrase.constants'
import type { PaymentMethod } from '@custom_types/order/payment-method'
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

const paymentRestrictionOf = (methods: string[]): string => {
  const phrase =
    methods.length === 1
      ? PROMOTION_PAYMENT_PHRASE[methods[0] as PaymentMethod]
      : undefined
  return phrase ? `pagando ${phrase}` : 'em formas de pagamento selecionadas'
}

const restrictionOf = (promotion: PublicPromotion): string | null => {
  if (promotion.eligibleProductName) {
    return `no ${promotion.eligibleProductName}`
  }
  if (promotion.eligibleProductIds?.length) return 'em itens selecionados'
  if (promotion.firstOrderOnly) return 'no seu primeiro pedido'
  if (!promotion.allDeliveryZones) return 'em alguns bairros'
  if (promotion.paymentMethods?.length) {
    return paymentRestrictionOf(promotion.paymentMethods)
  }
  return null
}

const conditionOf = (promotion: PublicPromotion): string => {
  const restriction = restrictionOf(promotion)
  const minimum =
    promotion.minOrderValue > 0
      ? `acima de ${brl(promotion.minOrderValue)}`
      : null
  if (!restriction && !minimum) return 'em qualquer pedido'
  return [restriction, minimum].filter(Boolean).join(' ')
}

export const promotionLabel = (
  promotion: PublicPromotion,
  now: Date = new Date()
): string => {
  const condition = `${benefitOf(promotion)} ${conditionOf(promotion)}`
  return promotion.endsAt
    ? `${condition} · até ${untilOf(promotion.endsAt, now)}`
    : condition
}
