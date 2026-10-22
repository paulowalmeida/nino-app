export type Promotion = {
  id: string
  name: string
  description: string | null
  type: 'PERCENTAGE_DISCOUNT' | 'FIXED_DISCOUNT' | 'FREE_DELIVERY'
  trigger: 'AUTOMATIC' | 'COUPON'
  code: string | null
  value: number
  minOrderValue: number
  channels: ('DELIVERY' | 'PICKUP' | 'COUNTER' | 'TABLE_TAB')[]
  startsAt: string
  endsAt: string | null
  status: 'ACTIVE' | 'PAUSED' | 'ENDED'
  // WHY: agendada e esgotada não são gravadas; a API deriva da data e dos usos.
  state: 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'ENDED' | 'EXHAUSTED'
  // CONSTRAINT: 0 = domingo, e lista vazia significa todos os dias.
  weekdays: number[]
  dailyStartTime: string | null
  dailyEndTime: string | null
  allDeliveryZones: boolean
  deliveryZoneIds: string[]
  showInMenu: boolean
  perCustomerLimit: number | null
  totalLimit: number | null
  usageCount: number
  productIds: string[]
  categoryIds: string[]
  createdAt: string
  updatedAt: string
}
