export type PromotionType =
  | 'PERCENTAGE_DISCOUNT'
  | 'FIXED_DISCOUNT'
  | 'FREE_DELIVERY'

export type PromotionTrigger = 'AUTOMATIC' | 'COUPON'
export type PromotionChannel = 'DELIVERY' | 'PICKUP' | 'COUNTER' | 'TABLE_TAB'

export type Promotion = {
  id: string
  name: string
  description: string | null
  type: PromotionType
  trigger: PromotionTrigger
  code: string | null
  value: number
  minOrderValue: number
  channels: PromotionChannel[]
  startsAt: string | null
  endsAt: string | null
  isActive: boolean
  productIds: string[]
  categoryIds: string[]
  createdAt: string
  updatedAt: string
}

export type PromotionInput = {
  name: string
  description?: string
  type: PromotionType
  trigger: PromotionTrigger
  code?: string
  value: number
  minOrderValue?: number
  channels?: PromotionChannel[]
  startsAt?: string
  endsAt?: string
  isActive?: boolean
  productIds?: string[]
  categoryIds?: string[]
}
