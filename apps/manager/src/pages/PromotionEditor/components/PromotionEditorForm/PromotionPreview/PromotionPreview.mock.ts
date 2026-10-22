import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

export const previewValuesMock: PromotionFormValues = {
  campaignType: 'free-delivery',
  discountKind: 'PERCENTAGE_DISCOUNT',
  discountValue: '',
  maxDiscount: '',
  minOrderValue: '60,00',
  zoneScope: 'all',
  deliveryZoneIds: [],
  startsAtDate: new Date(2020, 0, 1),
  startsAtTime: '00:00',
  endsAtDate: undefined,
  endsAtTime: '23:59',
  weekdays: [2],
  hasDailyWindow: true,
  dailyStartTime: '18:00',
  dailyEndTime: '23:00',
  code: '',
  showInMenu: true,
  perCustomer: 'once',
  perCustomerCount: '',
  totalLimit: 50,
}
