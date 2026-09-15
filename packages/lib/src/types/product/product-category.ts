import type { ProductCategoryIcon } from './product-category-icon'

export type ProductCategory = {
  id: string
  name: string
  description: string | null
  position: number | null
  icon?: ProductCategoryIcon | null
  unitId: string
  createdAt: string
  updatedAt: string
}
