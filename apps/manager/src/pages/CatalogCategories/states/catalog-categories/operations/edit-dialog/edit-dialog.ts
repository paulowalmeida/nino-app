import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

export const requestEdit = (
  set: SetCatalogCategoriesState,
  category: CategoryWithCount
) =>
  set({
    editTarget: category,
    editName: category.name,
    editIcon: category.icon ?? null,
  })

export const setEditName = (set: SetCatalogCategoriesState, name: string) =>
  set({ editName: name })

export const setEditIcon = (
  set: SetCatalogCategoriesState,
  icon: ProductCategoryIcon | null
) => set({ editIcon: icon })

export const closeEdit = (set: SetCatalogCategoriesState) =>
  set({ editTarget: null, editName: '', editIcon: null })
