import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

export type CatalogCategoriesState = {
  createName: string
  createIcon: ProductCategoryIcon | null
  order: CategoryWithCount[]
  deleteTarget: CategoryWithCount | null
  deleteError: string | null
  editTarget: CategoryWithCount | null
  editName: string
  editIcon: ProductCategoryIcon | null
  setCreateName: (name: string) => void
  setCreateIcon: (icon: ProductCategoryIcon | null) => void
  clearCreateName: () => void
  setOrder: (order: CategoryWithCount[]) => void
  requestDelete: (category: CategoryWithCount) => void
  setDeleteError: (error: string | null) => void
  closeDelete: () => void
  requestEdit: (category: CategoryWithCount) => void
  setEditName: (name: string) => void
  setEditIcon: (icon: ProductCategoryIcon | null) => void
  closeEdit: () => void
}
