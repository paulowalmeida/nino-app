export type PublicPromotion = {
  id: string
  name: string
  type:
    | 'PERCENTAGE_DISCOUNT'
    | 'FIXED_DISCOUNT'
    | 'FREE_DELIVERY'
    | 'GIFT'
    | 'PACKAGE'
  value: number
  code: string | null
  minOrderValue: number
  maxDiscount: number | null
  endsAt: string | null
  allDeliveryZones: boolean
  deliveryZoneIds: string[]
  giftProduct: { id: string; name: string; price: number } | null
  imageUrl?: string | null
  showInBanner?: boolean
  firstOrderOnly?: boolean
  /** Vazio ou ausente = qualquer forma de pagamento. */
  paymentMethods?: string[]
  /** Produtos em que o desconto incide; null ou ausente = cardápio todo. */
  eligibleProductIds?: string[] | null
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
}
