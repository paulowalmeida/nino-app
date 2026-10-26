import type { Promotion } from '@shared/types/marketing/promotion.type'

export type PromotionInput = {
  name: string
  type: Promotion['type']
  code?: string | null
  value?: number
  minOrderValue?: number
  maxDiscount?: number | null
  giftProductId?: string | null
  packageGroups?: {
    kind: 'FIXED' | 'CHOICE'
    quantity: number
    allowRepeatedProducts: boolean
    products: { productId: string; allowedOptionIds: string[] }[]
  }[]
  startsAt: string
  endsAt?: string | null
  weekdays?: number[]
  dailyStartTime?: string | null
  dailyEndTime?: string | null
  allDeliveryZones?: boolean
  deliveryZoneIds?: string[]
  showInMenu?: boolean
  showInBanner?: boolean
  perCustomerLimit?: number | null
  totalLimit?: number | null
}
