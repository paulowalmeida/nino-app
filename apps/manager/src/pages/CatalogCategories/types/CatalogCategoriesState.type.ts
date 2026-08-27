import type { CategoryWithCount } from '@shared/types/product/category-with-count'

export type CatalogCategoriesState = {
  createName: string
  order: CategoryWithCount[]
  deleteTarget: CategoryWithCount | null
  deleteError: string | null
  setCreateName: (name: string) => void
  clearCreateName: () => void
  setOrder: (order: CategoryWithCount[]) => void
  requestDelete: (category: CategoryWithCount) => void
  setDeleteError: (error: string | null) => void
  closeDelete: () => void
}
