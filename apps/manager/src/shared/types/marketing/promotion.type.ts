export type Promotion = {
  id: string
  name: string
  description: string | null
  type:
    | 'PERCENTAGE_DISCOUNT'
    | 'FIXED_DISCOUNT'
    | 'FREE_DELIVERY'
    | 'GIFT'
    | 'PACKAGE'
  trigger: 'AUTOMATIC' | 'COUPON'
  code: string | null
  value: number
  minOrderValue: number
  // CONSTRAINT: teto em reais, só no desconto percentual.
  maxDiscount: number | null
  giftProduct: {
    id: string
    name: string
    price: number
    isAvailable: boolean
  } | null
  imageUrl?: string | null
  showInBanner?: boolean
  packageGroups?: {
    id: string
    kind: 'FIXED' | 'CHOICE'
    quantity: number
    allowRepeatedProducts: boolean
    products: {
      id: string
      name: string
      price: number
      isAvailable: boolean
      imageUrl: string | null
      allowedOptions: {
        id: string
        name: string
        price: number
        modifierId: string
        modifierName: string
        isRequired: boolean
        minSelections: number
        maxSelections: number
      }[]
    }[]
  }[]
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
  createdBy: { name: string } | null
  createdAt: string
  updatedAt: string
}
