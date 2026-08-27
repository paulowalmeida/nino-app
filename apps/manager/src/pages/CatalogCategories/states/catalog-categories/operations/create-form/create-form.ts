import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'

export const setCreateName = (
  set: SetCatalogCategoriesState,
  name: string
) => set({ createName: name })

export const clearCreateName = (set: SetCatalogCategoriesState) =>
  set({ createName: '' })
