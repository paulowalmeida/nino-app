import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'

import type { MenuItemImage } from './menu-item-image'

/** Item do cardápio como o consumidor o vê. Preço em string decimal. */
export type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  isActive: boolean
  category: {
    id: string
    name: string
    position: number
    icon?: ProductCategoryIcon | null
  }
  images: MenuItemImage[]
}
