export type PublicPromotion = {
  id: string
  name: string
  type: 'PERCENTAGE_DISCOUNT' | 'FIXED_DISCOUNT' | 'FREE_DELIVERY'
  value: number
  code: string | null
  minOrderValue: number
  maxDiscount: number | null
  endsAt: string | null
  allDeliveryZones: boolean
  deliveryZoneIds: string[]
}
