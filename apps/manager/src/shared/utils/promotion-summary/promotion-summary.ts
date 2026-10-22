import { PROMOTION_WEEKDAY_LABELS } from '@shared/constants/promotion.constants'
import type { PromotionSummaryParts } from '@shared/types/marketing/promotion-summary-parts.type'
import type { PromotionSummarySource } from '@shared/types/marketing/promotion-summary-source.type'
import { brl } from '@shared/utils/money/money'

const DAY_MS = 24 * 60 * 60 * 1000

const shortDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})
const weekdayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

const hourLabel = (time: string): string => {
  const [hour, minute] = time.split(':')
  return minute === '00' ? `${Number(hour)}h` : `${Number(hour)}h${minute}`
}

const benefitOf = ({
  type,
  value,
  maxDiscount,
  giftProduct,
}: PromotionSummarySource): string => {
  if (type === 'FREE_DELIVERY') return 'Frete grátis'
  if (type === 'GIFT') return `Ganhe ${giftProduct?.name ?? 'um brinde'}`
  if (type === 'FIXED_DISCOUNT') return `${brl(value)} de desconto`
  return maxDiscount
    ? `${value}% de desconto (até ${brl(maxDiscount)})`
    : `${value}% de desconto`
}

const headlineOf = (promotion: PromotionSummarySource): string => {
  const { minOrderValue } = promotion
  const benefit = benefitOf(promotion)
  return minOrderValue > 0
    ? `${benefit} acima de ${brl(minOrderValue)}`
    : `${benefit} em qualquer pedido`
}

const isConsecutive = (days: number[]): boolean =>
  days.every((day, index) => index === 0 || day === days[index - 1] + 1)

const daysLabel = (weekdays: number[]): string | null => {
  if (!weekdays.length || weekdays.length === 7) return null
  const days = [...weekdays].sort((first, second) => first - second)
  const labels = days.map((day) => PROMOTION_WEEKDAY_LABELS[day])
  if (days.length >= 3 && isConsecutive(days)) {
    return `${labels[0]} a ${labels[labels.length - 1]}`
  }
  return labels.length === 1
    ? labels[0]
    : `${labels.slice(0, -1).join(', ')} e ${labels[labels.length - 1]}`
}

const scheduleOf = ({
  weekdays,
  dailyStartTime,
  dailyEndTime,
}: PromotionSummarySource): string | null => {
  const days = daysLabel(weekdays)
  const hours =
    dailyStartTime && dailyEndTime
      ? `${hourLabel(dailyStartTime)}–${hourLabel(dailyEndTime)}`
      : null
  return [days, hours].filter(Boolean).join(', ') || null
}

const periodOf = (
  { startsAt, endsAt }: PromotionSummarySource,
  now: Date
): string | null => {
  const start = new Date(startsAt)
  if (start > now) return `a partir de ${shortDate.format(start)}`
  if (!endsAt) return null
  const end = new Date(endsAt)
  const daysLeft = (end.getTime() - now.getTime()) / DAY_MS
  if (daysLeft > 0 && daysLeft < 7) return `até ${weekdayName.format(end)}`
  return `até ${shortDate.format(end)}`
}

export const promotionSummaryParts = (
  promotion: PromotionSummarySource,
  now: Date = new Date()
): PromotionSummaryParts => ({
  headline: headlineOf(promotion),
  schedule: scheduleOf(promotion),
  zones: promotion.allDeliveryZones
    ? null
    : `${promotion.deliveryZoneIds.length} ${
        promotion.deliveryZoneIds.length === 1 ? 'zona' : 'zonas'
      }`,
  period: periodOf(promotion, now),
})
