import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'

export type ProductCategory = {
  id: string
  name: string
  description?: string | null
  position: number
  icon?: ProductCategoryIcon | null
}
