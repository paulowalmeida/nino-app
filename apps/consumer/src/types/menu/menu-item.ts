export type MenuItemImage = {
  id: string
  url: string
  isPrimary: boolean
}

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
import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
