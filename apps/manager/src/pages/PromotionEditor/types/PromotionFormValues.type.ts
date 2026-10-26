import type { PaymentMethod } from '@shared/types/order/payment-method'

export type PromotionFormValues = {
  // CONSTRAINT: vazio cai na headline ao salvar.
  name: string
  campaignType: 'free-delivery' | 'discount' | 'gift' | 'package'
  giftProductId: string
  discountKind: 'PERCENTAGE_DISCOUNT' | 'FIXED_DISCOUNT'
  // CONSTRAINT: percentual em número ("10") ou valor mascarado ("10,00").
  discountValue: string
  maxDiscount: string
  packagePrice: string
  packageGroups: {
    kind: 'FIXED' | 'CHOICE'
    quantity: number
    allowRepeatedProducts: boolean
    products: { productId: string; allowedOptionIds: string[] }[]
  }[]
  // CONSTRAINT: valor mascarado ("60,00"); vazio significa sem mínimo.
  minOrderValue: string
  zoneScope: 'all' | 'chosen'
  deliveryZoneIds: string[]
  startsAtDate: Date | undefined
  startsAtTime: string
  endsAtDate: Date | undefined
  endsAtTime: string
  weekdays: number[]
  hasDailyWindow: boolean
  dailyStartTime: string
  dailyEndTime: string
  code: string
  showInMenu: boolean
  imageUrl: string | null
  imageFile: File | null
  removeImage: boolean
  showInBanner: boolean
  perCustomer: 'unlimited' | 'once' | 'custom'
  perCustomerCount: number | ''
  totalLimit: number | ''
  firstOrderOnly: boolean
  // CONSTRAINT: vazio = qualquer forma de pagamento.
  paymentMethods: PaymentMethod[]
  productScope: 'all' | 'chosen'
  scopeCategoryIds: string[]
  scopeProductIds: string[]
}
