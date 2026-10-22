import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'
import type { Promotion } from '@shared/types/marketing/promotion.type'

export const formNowMock = new Date(2026, 9, 22, 12, 30)

export const pastCampaignMock: Promotion = {
  ...promotionMock,
  minOrderValue: 60,
  startsAt: new Date(2026, 9, 1, 0, 0).toISOString(),
  endsAt: new Date(2026, 9, 10, 23, 59).toISOString(),
  weekdays: [2, 4],
  dailyStartTime: '18:00',
  dailyEndTime: '23:00',
  allDeliveryZones: false,
  deliveryZoneIds: ['zone-1'],
  code: 'FRETE',
  showInMenu: false,
  perCustomerLimit: 3,
  totalLimit: 50,
}

export const filledFormMock: PromotionFormValues = {
  minOrderValue: '60,00',
  zoneScope: 'chosen',
  deliveryZoneIds: ['zone-1'],
  startsAtDate: new Date(2026, 9, 22),
  startsAtTime: '18:00',
  endsAtDate: new Date(2026, 9, 25),
  endsAtTime: '23:59',
  weekdays: [5, 6],
  hasDailyWindow: true,
  dailyStartTime: '18:00',
  dailyEndTime: '02:00',
  code: ' frete ',
  showInMenu: false,
  perCustomer: 'once',
  perCustomerCount: '',
  totalLimit: 50,
}
