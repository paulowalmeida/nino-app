import { useEffect, useRef, useState } from 'react'

import { Reorder } from 'framer-motion'

import { Box } from '@nino/ds/components/Box'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { MenuRow } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRow'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'
import { canReorderCatalog } from '@pages/Catalog/utils/catalog-rules'
import { useLoadMore } from '@shared/hooks/ui/useLoadMore/useLoadMore'
import type { MenuItem } from '@shared/types/product/menu-item'

import styles from '@pages/Catalog/components/CatalogContent/CatalogItems/CatalogItems.module.css'

type CatalogItemsProps = {
  className?: string
}

export const CatalogItems = ({ className }: CatalogItemsProps) => {
  const {
    categoryId,
    search,
    items,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    isSelecting,
    selectedIds,
    toggleItemSelection,
    requestDeleteItem,
    setAvailability,
    reorderItems,
    resetSelection,
    unitRole,
  } = useCatalogFacade()
  const loadMoreSentinelRef = useLoadMore(hasNextPage, () => void loadMore())
  const canManageCatalog =
    unitRole === 'UNIT_OWNER' || unitRole === 'MANAGER'
  const canReorder = canManageCatalog && canReorderCatalog(categoryId, search)
  const [reorderedItems, setReorderedItems] = useState<{
    source: MenuItem[]
    values: MenuItem[]
  } | null>(null)
  const sortedItems =
    reorderedItems?.source === items ? reorderedItems.values : items
  const sortedItemsRef = useRef(sortedItems)
  const previousItemsRef = useRef(items)

  useEffect(() => {
    if (items === previousItemsRef.current) return
    previousItemsRef.current = items
    resetSelection()
  }, [items, resetSelection])

  useEffect(() => {
    sortedItemsRef.current = sortedItems
  }, [sortedItems])

  return (
    <ScrollArea className={className}>
      <Box className={styles.catalogItemsList}>
        <Reorder.Group
          as="ul"
          axis="y"
          values={sortedItems}
          onReorder={(values) => setReorderedItems({ source: items, values })}
        >
          {sortedItems.map((item, index) => (
            <MenuRow
              key={item.id}
              item={item}
              index={index}
              canReorder={canReorder && !isSelecting}
              canManageCatalog={canManageCatalog}
              isSelecting={isSelecting}
              isSelected={selectedIds.has(item.id)}
              onToggleSelect={toggleItemSelection}
              onToggleAvailability={(id, isActive) =>
                void setAvailability({ id, isActive })
              }
              onDelete={requestDeleteItem}
              onDragEnd={() => void reorderItems(sortedItemsRef.current)}
            />
          ))}
        </Reorder.Group>
      </Box>

      <Box ref={loadMoreSentinelRef} className={styles.sentinel}>
        {isFetchingNextPage && (
          <Text as="span" size="xs" color="faint">
            Carregando mais itens…
          </Text>
        )}
      </Box>
    </ScrollArea>
  )
}
