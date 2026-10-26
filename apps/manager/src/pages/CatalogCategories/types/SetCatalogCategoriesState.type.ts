import type { CatalogCategoriesState } from '@pages/CatalogCategories/types/CatalogCategoriesState.type'

export type SetCatalogCategoriesState = (
  state:
    | Partial<CatalogCategoriesState>
    | ((current: CatalogCategoriesState) => Partial<CatalogCategoriesState>)
) => void
