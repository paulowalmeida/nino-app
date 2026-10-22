import type { Promotion } from '@shared/types/marketing/promotion.type'

export type PromotionInput = {
  name: string
  type: Promotion['type']
  code?: string | null
  value?: number
  minOrderValue?: number
  startsAt: string
  endsAt?: string | null
  weekdays?: number[]
  dailyStartTime?: string | null
  dailyEndTime?: string | null
  allDeliveryZones?: boolean
  deliveryZoneIds?: string[]
  showInMenu?: boolean
  perCustomerLimit?: number | null
  totalLimit?: number | null
}
