import type { MenuItemImage } from './menu-item-image'
import type { MenuItemModifier } from './menu-item-modifier'
import type { ProductCategory } from './product-category'

export type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  pricingType?: 'FIXED' | 'COMPOSED'
  isActive: boolean
  requiresPreparation?: boolean
  position: number
  category: ProductCategory
  images: MenuItemImage[]
  /** Preset returned by the API when the product has no uploaded image. */
  fallbackUrl?: string | null
  modifiers?: MenuItemModifier[]
}
