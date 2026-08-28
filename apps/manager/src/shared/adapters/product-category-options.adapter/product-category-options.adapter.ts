import type { ProductCategory } from '@shared/types/product/product-category'
import type { ProductCategoryOption } from '@shared/types/product/product-category-option'

export const toProductCategoryOptions = (
  categories: ProductCategory[]
): ProductCategoryOption[] =>
  categories.map(({ id, name }) => ({ value: id, label: name }))
