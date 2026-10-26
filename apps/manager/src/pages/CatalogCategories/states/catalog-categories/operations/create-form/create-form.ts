import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'

export const setCreateName = (set: SetCatalogCategoriesState, name: string) =>
  set({ createName: name })

export const clearCreateName = (set: SetCatalogCategoriesState) =>
  set({ createName: '', createIcon: null })

export const setCreateIcon = (
  set: SetCatalogCategoriesState,
  icon: ProductCategoryIcon | null
) => set({ createIcon: icon })
