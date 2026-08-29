import type { MenuItem } from './menu-item'
import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'

/** Uma categoria com seus itens — como a vitrine agrupa o cardápio. */
export type MenuSection = {
  id: string
  name: string
  position: number
  icon?: ProductCategoryIcon | null
  items: MenuItem[]
}
