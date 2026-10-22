import type { PromotionSummarySource } from '@shared/types/marketing/promotion-summary-source.type'

export const summaryNowMock = new Date('2026-10-22T15:00:00.000Z')

export const freeDeliverySummaryMock: PromotionSummarySource = {
  type: 'FREE_DELIVERY',
  value: 0,
  minOrderValue: 60,
  startsAt: '2026-10-01T03:00:00.000Z',
  endsAt: '2026-10-25T23:00:00.000Z',
  weekdays: [],
  dailyStartTime: null,
  dailyEndTime: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
}
