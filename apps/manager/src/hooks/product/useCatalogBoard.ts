import { useCallback } from 'react'

import { useCatalog } from '@hooks/product/useCatalog'
import { useItemAvailability } from '@hooks/product/useItemAvailability'
import { useReorderMenuItems } from '@hooks/product/useReorderMenuItems'
import { useLoadMore } from '@hooks/ui/useLoadMore'
import type { MenuItem } from '@custom_types/product/menu-item'

export const useCatalogBoard = (
  tenantId: string | null,
  categoryId: string | null,
  search: string
) => {
  const catalog = useCatalog(tenantId, { categoryId, search })
  const { mutate: setAvailability } = useItemAvailability(tenantId)
  const { mutate: reorder } = useReorderMenuItems(tenantId, categoryId)
  const loadMoreSentinelRef = useLoadMore(
    !!catalog.hasNextPage,
    () => void catalog.fetchNextPage()
  )

  const reorderItems = useCallback(
    (orderedItems: MenuItem[]) => {
      const positions = catalog.items
        .map((item) => item.position)
        .sort((left, right) => left - right)
      const positionById = new Map(
        catalog.items.map((item) => [item.id, item.position])
      )
      const changes = orderedItems
        .map((item, index) => ({ id: item.id, position: positions[index] }))
        .filter(({ id, position }) => positionById.get(id) !== position)

      if (changes.length > 0) reorder({ positions: changes })
    },
    [catalog.items, reorder]
  )

  return {
    ...catalog,
    loadMoreSentinelRef,
    setAvailability,
    reorderItems,
  }
}
