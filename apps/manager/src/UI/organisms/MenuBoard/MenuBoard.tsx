import { useEffect, useRef, useState, type RefCallback } from 'react'

import { Reorder } from 'framer-motion'

import { Box } from '@nino/ds/components/Box'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { MenuBoardControls } from '@molecules/MenuBoardControls/MenuBoardControls'
import { MenuRow } from '@molecules/MenuRow/MenuRow'
import type { MenuItem } from '@custom_types/product/menu-item'

import styles from './MenuBoard.module.css'

type MenuBoardData = {
  items: MenuItem[]
  total: number
  isFetchingNextPage: boolean
  canReorder: boolean
  loadMoreSentinelRef: RefCallback<HTMLDivElement>
  onRequestDelete: (item: MenuItem) => void
  onAvailabilityChange: (id: string, isActive: boolean) => void
  onReorder: (items: MenuItem[]) => void
}

type MenuBoardSelection = {
  isSelecting: boolean
  selectedIds: Set<string>
  onStartSelection: () => void
  onToggleSelection: (id: string) => void
  onToggleAllSelection: () => void
  onCancelSelection: () => void
  onRequestBulkDelete: () => void
}

export type MenuBoardProps = {
  board: MenuBoardData
  selection: MenuBoardSelection
}

export const MenuBoard = ({ board, selection }: MenuBoardProps) => {
  const {
    items,
    total,
    isFetchingNextPage,
    canReorder,
    loadMoreSentinelRef,
    onRequestDelete,
    onAvailabilityChange,
    onReorder,
  } = board
  const { isSelecting, selectedIds, onToggleSelection } = selection
  const [sortedItems, setSortedItems] = useState(items)
  const [previousItems, setPreviousItems] = useState(items)
  const sortedItemsRef = useRef(sortedItems)
  const selectedLoadedItemCount = items.filter(({ id }) =>
    selectedIds.has(id)
  ).length
  const isAllLoadedSelected =
    items.length > 0 && selectedLoadedItemCount === items.length
  const isSomeLoadedSelected =
    selectedLoadedItemCount > 0 && !isAllLoadedSelected

  if (items !== previousItems) {
    setPreviousItems(items)
    setSortedItems(items)
  }

  useEffect(() => {
    sortedItemsRef.current = sortedItems
  }, [sortedItems])

  return (
    <Box className={styles.wrap}>
      <MenuBoardControls
        total={total}
        canReorder={canReorder}
        selection={{
          isSelecting,
          selectedItemCount: selectedLoadedItemCount,
          isAllLoadedSelected,
          isSomeLoadedSelected,
          onStartSelection: selection.onStartSelection,
          onToggleAllSelection: selection.onToggleAllSelection,
          onCancelSelection: selection.onCancelSelection,
          onRequestBulkDelete: selection.onRequestBulkDelete,
        }}
      />

      <ScrollArea className={styles.scroll}>
        <Box className={styles.list}>
          <Reorder.Group
            as="ul"
            axis="y"
            values={sortedItems}
            onReorder={setSortedItems}
            className={styles.items}
          >
            {sortedItems.map((item, index) => (
              <MenuRow
                key={item.id}
                item={item}
                index={index}
                canReorder={canReorder && !isSelecting}
                isSelecting={isSelecting}
                isSelected={selectedIds.has(item.id)}
                onToggleSelect={onToggleSelection}
                onToggleAvailability={onAvailabilityChange}
                onDelete={onRequestDelete}
                onDragEnd={() => onReorder(sortedItemsRef.current)}
              />
            ))}
          </Reorder.Group>
        </Box>

        <div ref={loadMoreSentinelRef} className={styles.sentinel}>
          {isFetchingNextPage && (
            <Text as="span" size="xs" color="faint">
              Carregando mais itens…
            </Text>
          )}
        </div>
      </ScrollArea>
    </Box>
  )
}
