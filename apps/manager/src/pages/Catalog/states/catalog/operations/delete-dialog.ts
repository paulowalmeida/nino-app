import type { SetCatalogState } from '@pages/Catalog/types/SetCatalogState.type'
import type { MenuItem } from '@shared/types/product/menu-item'

export const requestDeleteItem = (set: SetCatalogState, item: MenuItem) =>
  set({ itemPendingDelete: item })

export const closeDeleteItem = (set: SetCatalogState) =>
  set({ itemPendingDelete: null })

export const requestDeleteItems = (set: SetCatalogState, ids: string[]) =>
  set({ idsPendingDelete: ids })

export const closeDeleteItems = (set: SetCatalogState) =>
  set({ idsPendingDelete: [] })
