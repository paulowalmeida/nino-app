import type { SetCatalogState } from '@pages/Catalog/types/SetCatalogState.type'

export const setCategoryId = (
  set: SetCatalogState,
  categoryId: string | null
) => set({ categoryId })

export const setSearch = (set: SetCatalogState, search: string) =>
  set({ search })
