import type { PromotionEditorMode } from '@pages/PromotionEditor/types/PromotionEditorMode.type'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import type { Promotion } from '@shared/types/marketing/promotion.type'
import type { PromotionInput } from '@shared/types/marketing/promotion-input.type'
import type { PromotionSummarySource } from '@shared/types/marketing/promotion-summary-source.type'
import { maskMoneyAmount, moneyValue } from '@shared/utils/money/money'
import { promotionSummaryParts } from '@shared/utils/promotion-summary/promotion-summary'

const pad = (value: number) => String(value).padStart(2, '0')

const timeOf = (date: Date): string =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`

const atTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number)
  const combined = new Date(date)
  combined.setHours(hours, minutes, 0, 0)
  return combined
}

export const combineDateTime = (
  date: Date | undefined,
  time: string
): Date | null => (date ? atTime(date, time || '00:00') : null)

const perCustomerOf = (
  limit: number | null
): Pick<PromotionFormValues, 'perCustomer' | 'perCustomerCount'> =>
  limit === null
    ? { perCustomer: 'unlimited', perCustomerCount: '' }
    : limit === 1
      ? { perCustomer: 'once', perCustomerCount: '' }
      : { perCustomer: 'custom', perCustomerCount: limit }

const blankValues = (now: Date): PromotionFormValues => ({
  minOrderValue: '',
  zoneScope: 'all',
  deliveryZoneIds: [],
  startsAtDate: now,
  startsAtTime: timeOf(now),
  endsAtDate: undefined,
  endsAtTime: '23:59',
  weekdays: [],
  hasDailyWindow: false,
  dailyStartTime: '18:00',
  dailyEndTime: '23:00',
  code: '',
  showInMenu: true,
  perCustomer: 'unlimited',
  perCustomerCount: '',
  totalLimit: '',
})

/* WHY: duplicar copia as regras, mas início e fim que já passaram voltam para
 * "agora" e "sem fim" — senão a cópia nasceria encerrada. */
export const toPromotionFormValues = (
  promotion: Promotion | undefined,
  mode: PromotionEditorMode,
  now: Date = new Date()
): PromotionFormValues => {
  if (!promotion || mode === 'create') return blankValues(now)
  const startsAt = new Date(promotion.startsAt)
  const endsAt = promotion.endsAt ? new Date(promotion.endsAt) : null
  const keepStart = mode === 'edit' || startsAt > now
  const keepEnd = !!endsAt && (mode === 'edit' || endsAt > now)
  const start = keepStart ? startsAt : now
  return {
    ...blankValues(now),
    minOrderValue: promotion.minOrderValue
      ? maskMoneyAmount(promotion.minOrderValue)
      : '',
    zoneScope: promotion.allDeliveryZones ? 'all' : 'chosen',
    deliveryZoneIds: promotion.deliveryZoneIds,
    startsAtDate: start,
    startsAtTime: timeOf(start),
    endsAtDate: keepEnd ? endsAt : undefined,
    endsAtTime: keepEnd && endsAt ? timeOf(endsAt) : '23:59',
    weekdays: promotion.weekdays,
    hasDailyWindow: !!promotion.dailyStartTime,
    dailyStartTime: promotion.dailyStartTime ?? '18:00',
    dailyEndTime: promotion.dailyEndTime ?? '23:00',
    code: promotion.code ?? '',
    showInMenu: promotion.showInMenu,
    ...perCustomerOf(promotion.perCustomerLimit),
    totalLimit: promotion.totalLimit ?? '',
  }
}

const perCustomerLimitOf = ({
  perCustomer,
  perCustomerCount,
}: PromotionFormValues): number | null =>
  perCustomer === 'unlimited'
    ? null
    : perCustomer === 'once'
      ? 1
      : Number(perCustomerCount)

export const toPromotionSummarySource = (
  values: PromotionFormValues
): PromotionSummarySource => ({
  type: 'FREE_DELIVERY',
  value: 0,
  minOrderValue: values.minOrderValue ? moneyValue(values.minOrderValue) : 0,
  startsAt: (
    combineDateTime(values.startsAtDate, values.startsAtTime) ?? new Date()
  ).toISOString(),
  endsAt:
    combineDateTime(values.endsAtDate, values.endsAtTime)?.toISOString() ??
    null,
  weekdays: values.weekdays,
  dailyStartTime: values.hasDailyWindow ? values.dailyStartTime : null,
  dailyEndTime: values.hasDailyWindow ? values.dailyEndTime : null,
  allDeliveryZones: values.zoneScope === 'all',
  deliveryZoneIds: values.zoneScope === 'all' ? [] : values.deliveryZoneIds,
})

export const toPromotionInput = (values: PromotionFormValues): PromotionInput => {
  const source = toPromotionSummarySource(values)
  return {
    name: promotionSummaryParts(source).headline,
    type: 'FREE_DELIVERY',
    code: values.code.trim() || null,
    minOrderValue: source.minOrderValue,
    startsAt: source.startsAt,
    endsAt: source.endsAt,
    weekdays: source.weekdays,
    dailyStartTime: source.dailyStartTime,
    dailyEndTime: source.dailyEndTime,
    allDeliveryZones: source.allDeliveryZones,
    deliveryZoneIds: source.deliveryZoneIds,
    showInMenu: values.showInMenu,
    perCustomerLimit: perCustomerLimitOf(values),
    totalLimit: values.totalLimit === '' ? null : Number(values.totalLimit),
  }
}
