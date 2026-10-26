import type { ProductCategoryIcon } from './product-category-icon'

export type UpdateProductCategoryRequest = {
  name?: string
  description?: string
  position?: number
  icon?: ProductCategoryIcon | null
}
