import type { ProductCategory } from './product-category'

export type CategoryWithCount = ProductCategory & {
  position: number
  count: number
}
