import type { ProductCategoryIcon } from './product-category-icon'

export type ProductCategory = {
  id: string
  name: string
  description: string | null
  position: number | null
  icon?: ProductCategoryIcon | null
  tenantId: string
  createdAt: string
  updatedAt: string
}
