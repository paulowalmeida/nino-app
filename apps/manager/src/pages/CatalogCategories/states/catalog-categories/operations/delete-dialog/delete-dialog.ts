import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

export const requestDelete = (
  set: SetCatalogCategoriesState,
  category: CategoryWithCount
) => set({ deleteTarget: category, deleteError: null })

export const setDeleteError = (
  set: SetCatalogCategoriesState,
  deleteError: string | null
) => set({ deleteError })

export const closeDelete = (set: SetCatalogCategoriesState) =>
  set({ deleteTarget: null, deleteError: null })
