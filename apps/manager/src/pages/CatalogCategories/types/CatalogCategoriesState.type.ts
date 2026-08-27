import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

export type CatalogCategoriesState = {
  createName: string
  createIcon: ProductCategoryIcon | null
  order: CategoryWithCount[]
  deleteTarget: CategoryWithCount | null
  deleteError: string | null
  setCreateName: (name: string) => void
  setCreateIcon: (icon: ProductCategoryIcon | null) => void
  clearCreateName: () => void
  setOrder: (order: CategoryWithCount[]) => void
  requestDelete: (category: CategoryWithCount) => void
  setDeleteError: (error: string | null) => void
  closeDelete: () => void
}
