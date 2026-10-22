import type { Promotion } from '@shared/types/marketing/promotion.type'

export type PromotionSummarySource = Pick<
  Promotion,
  | 'type'
  | 'value'
  | 'minOrderValue'
  | 'startsAt'
  | 'endsAt'
  | 'weekdays'
  | 'dailyStartTime'
  | 'dailyEndTime'
  | 'allDeliveryZones'
  | 'deliveryZoneIds'
>
