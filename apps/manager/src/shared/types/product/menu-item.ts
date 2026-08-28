import type { MenuItemImage } from './menu-item-image'
import type { ProductCategory } from './product-category'

export type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  isActive: boolean
  requiresPreparation?: boolean
  position: number
  category: ProductCategory
  images: MenuItemImage[]
}
