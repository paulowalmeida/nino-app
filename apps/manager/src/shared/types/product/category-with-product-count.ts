import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'

export type CategoryWithProductCount = {
  id: string
  name: string
  position: number
  productCount: number
  icon?: ProductCategoryIcon | null
}
