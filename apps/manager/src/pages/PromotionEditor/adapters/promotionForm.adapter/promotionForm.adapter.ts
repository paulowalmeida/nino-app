import { campaignDefaultName } from '@pages/PromotionEditor/utils/campaignDefaultName/campaignDefaultName'
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
  name: campaignDefaultName('discount', now),
  campaignType: 'discount',
  giftProductId: '',
  discountKind: 'PERCENTAGE_DISCOUNT',
  discountValue: '',
  maxDiscount: '',
  packagePrice: '',
  packageGroups: [],
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
  imageUrl: null,
  imageFile: null,
  removeImage: false,
  showInBanner: false,
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
    ...discountFieldsOf(promotion),
    name: promotion.name,
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
    imageUrl: promotion.imageUrl ?? null,
    showInBanner: promotion.showInBanner ?? false,
    packagePrice:
      promotion.type === 'PACKAGE' ? maskMoneyAmount(promotion.value) : '',
    packageGroups: (promotion.packageGroups ?? []).map((group) => ({
      kind: group.kind,
      quantity: group.quantity,
      allowRepeatedProducts: group.allowRepeatedProducts,
      products: group.products.map((product) => ({
        productId: product.id,
        allowedOptionIds: product.allowedOptions.map(({ id }) => id),
      })),
    })),
    ...perCustomerOf(promotion.perCustomerLimit),
    totalLimit: promotion.totalLimit ?? '',
  }
}

const discountFieldsOf = ({
  type,
  value,
  maxDiscount,
  giftProduct,
}: Promotion): Pick<
  PromotionFormValues,
  | 'campaignType'
  | 'giftProductId'
  | 'discountKind'
  | 'discountValue'
  | 'maxDiscount'
> =>
  type === 'FREE_DELIVERY' || type === 'GIFT' || type === 'PACKAGE'
    ? {
        campaignType:
          type === 'GIFT'
            ? 'gift'
            : type === 'PACKAGE'
              ? 'package'
              : 'free-delivery',
        giftProductId: giftProduct?.id ?? '',
        discountKind: 'PERCENTAGE_DISCOUNT',
        discountValue: '',
        maxDiscount: '',
      }
    : {
        campaignType: 'discount',
        giftProductId: '',
        discountKind: type,
        discountValue:
          type === 'PERCENTAGE_DISCOUNT'
            ? String(value)
            : maskMoneyAmount(value),
        maxDiscount: maxDiscount ? maskMoneyAmount(maxDiscount) : '',
      }

const typeOf = ({
  campaignType,
  discountKind,
}: PromotionFormValues): Promotion['type'] =>
  campaignType === 'free-delivery'
    ? 'FREE_DELIVERY'
    : campaignType === 'gift'
      ? 'GIFT'
      : campaignType === 'package'
        ? 'PACKAGE'
        : discountKind

// CONSTRAINT: percentual chega digitado ("12,5"); valor fixo, mascarado ("10,00").
export const discountAmountOf = ({
  discountKind,
  discountValue,
}: Pick<PromotionFormValues, 'discountKind' | 'discountValue'>): number =>
  !discountValue
    ? 0
    : discountKind === 'PERCENTAGE_DISCOUNT'
      ? Number(discountValue.replace(',', '.'))
      : moneyValue(discountValue)

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
  values: PromotionFormValues,
  giftProductName?: string
): PromotionSummarySource => {
  const type = typeOf(values)
  const isFreeDelivery = type === 'FREE_DELIVERY'
  return {
    type,
    value:
      type === 'FREE_DELIVERY' || type === 'GIFT'
        ? 0
        : type === 'PACKAGE'
          ? moneyValue(values.packagePrice)
          : discountAmountOf(values),
    giftProduct: giftProductName ? { name: giftProductName } : null,
    maxDiscount:
      type === 'PERCENTAGE_DISCOUNT' && values.maxDiscount
        ? moneyValue(values.maxDiscount)
        : null,
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
    allDeliveryZones: !isFreeDelivery || values.zoneScope === 'all',
    deliveryZoneIds:
      isFreeDelivery && values.zoneScope === 'chosen'
        ? values.deliveryZoneIds
        : [],
  }
}

export const toPromotionInput = (
  values: PromotionFormValues
): PromotionInput => {
  const source = toPromotionSummarySource(values)
  return {
    name: values.name.trim() || promotionSummaryParts(source).headline,
    type: source.type,
    code:
      source.type === 'PERCENTAGE_DISCOUNT' || source.type === 'FIXED_DISCOUNT'
        ? values.code.trim() || null
        : null,
    value: source.value,
    maxDiscount: source.maxDiscount,
    giftProductId: source.type === 'GIFT' ? values.giftProductId : null,
    packageGroups: source.type === 'PACKAGE' ? values.packageGroups : undefined,
    minOrderValue: source.minOrderValue,
    startsAt: source.startsAt,
    endsAt: source.endsAt,
    weekdays: source.weekdays,
    dailyStartTime: source.dailyStartTime,
    dailyEndTime: source.dailyEndTime,
    allDeliveryZones: source.allDeliveryZones,
    deliveryZoneIds: source.deliveryZoneIds,
    showInMenu: source.type === 'PACKAGE' ? true : values.showInMenu,
    showInBanner: values.showInBanner,
    perCustomerLimit: perCustomerLimitOf(values),
    totalLimit: values.totalLimit === '' ? null : Number(values.totalLimit),
  }
}
