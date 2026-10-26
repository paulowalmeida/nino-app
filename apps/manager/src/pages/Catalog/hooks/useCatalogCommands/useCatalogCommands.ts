import { useCallback } from 'react'

import { useCatalogMutations } from '@pages/Catalog/hooks/useCatalogMutations/useCatalogMutations'
import { useCatalogQuery } from '@pages/Catalog/hooks/useCatalogQuery/useCatalogQuery'
import type { CatalogState } from '@pages/Catalog/types/CatalogState.type'
import type { MenuItem } from '@shared/types/product/menu-item'

export const useCatalogCommands = (
  query: ReturnType<typeof useCatalogQuery>,
  clientState: Pick<CatalogState, 'toggleAllItemsSelection'>,
  mutations: ReturnType<typeof useCatalogMutations>
) => {
  const { fetchNextPage, items } = query
  const { toggleAllItemsSelection: toggleAll } = clientState
  const loadMore = useCallback(() => fetchNextPage(), [fetchNextPage])
  const toggleAllItemsSelection = useCallback(
    () => toggleAll(items.map((item) => item.id)),
    [items, toggleAll]
  )
  const setAvailability = useCallback(
    (data: { id: string; isActive: boolean }) =>
      mutations.setAvailability.mutateAsync(data),
    [mutations.setAvailability]
  )
  const reorderItems = useCallback(
    (items: MenuItem[]) => mutations.reorderItems.mutateAsync(items),
    [mutations.reorderItems]
  )
  const deleteItem = useCallback(
    (id: string) => mutations.deleteItem.mutateAsync(id),
    [mutations.deleteItem]
  )
  const deleteItems = useCallback(
    (ids: string[]) => mutations.deleteItems.mutateAsync(ids),
    [mutations.deleteItems]
  )

  return {
    loadMore,
    toggleAllItemsSelection,
    setAvailability,
    reorderItems,
    deleteItem,
    deleteItems,
  }
}
