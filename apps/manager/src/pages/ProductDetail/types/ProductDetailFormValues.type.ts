import type { ProductModifierFormValue } from './ProductModifierFormValue.type'

export type ProductDetailFormValues = {
  name: string
  description: string
  price: string
  pricingType: 'FIXED' | 'COMPOSED'
  categoryId: string
  position: number
  isActive: boolean
  requiresPreparation: boolean
  modifiers: ProductModifierFormValue[]
}
