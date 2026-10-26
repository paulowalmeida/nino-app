import type { ProductCategoryIcon } from './product-category-icon'

export type CreateProductCategoryRequest = {
  name: string
  description?: string
  position?: number
  icon?: ProductCategoryIcon | null
}
