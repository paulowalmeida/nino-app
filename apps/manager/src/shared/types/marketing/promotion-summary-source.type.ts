import type { Promotion } from '@shared/types/marketing/promotion.type'

export type PromotionSummarySource = Pick<
  Promotion,
  | 'type'
  | 'value'
  | 'minOrderValue'
  | 'maxDiscount'
  | 'startsAt'
  | 'endsAt'
  | 'weekdays'
  | 'dailyStartTime'
  | 'dailyEndTime'
  | 'allDeliveryZones'
  | 'deliveryZoneIds'
> & {
  giftProduct?: { name: string } | null
}
