export type UpdateMenuItemRequest = {
  name: string
  description?: string
  price: number
  pricingType?: 'FIXED' | 'COMPOSED'
  categoryId: string
  position: number
  isActive: boolean
  requiresPreparation?: boolean
}
