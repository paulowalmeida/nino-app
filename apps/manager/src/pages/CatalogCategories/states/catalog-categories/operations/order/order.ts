import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

export const setCategoryOrder = (
  set: SetCatalogCategoriesState,
  order: CategoryWithCount[]
) => set({ order })
