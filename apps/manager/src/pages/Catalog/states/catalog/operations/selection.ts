import type { GetCatalogState } from '@pages/Catalog/types/GetCatalogState.type'
import type { SetCatalogState } from '@pages/Catalog/types/SetCatalogState.type'

export const startSelection = (set: SetCatalogState) =>
  set({ isSelecting: true })

export const clearSelection = (set: SetCatalogState) =>
  set({ isSelecting: false, selectedIds: new Set() })

export const toggleItemSelection = (
  set: SetCatalogState,
  get: GetCatalogState,
  id: string
) => {
  const selectedIds = new Set(get().selectedIds)
  if (selectedIds.has(id)) selectedIds.delete(id)
  else selectedIds.add(id)
  set({ selectedIds })
}

export const toggleAllItemsSelection = (
  set: SetCatalogState,
  get: GetCatalogState,
  itemIds: string[]
) => {
  const { selectedIds } = get()
  const isAllSelected =
    itemIds.length > 0 && itemIds.every((id) => selectedIds.has(id))
  set({
    selectedIds: isAllSelected ? new Set() : new Set(itemIds),
  })
}
