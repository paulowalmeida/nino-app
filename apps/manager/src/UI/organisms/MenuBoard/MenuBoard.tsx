import { useEffect, useRef, useState, type RefCallback } from 'react'

import { Reorder } from 'framer-motion'

import { Flexbox } from '@nino/ds/components/Flexbox'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import {
  MenuBoardControls,
  type MenuBoardSelection,
} from '@molecules/MenuBoardControls/MenuBoardControls'
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

export type MenuBoardProps = {
  board: MenuBoardData
  selection: MenuBoardSelection
}

export const MenuBoard = ({
  board,
  selection,
}: MenuBoardProps) => {
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
  const {
    isSelecting,
    selectedIds,
    onToggleSelection,
  } = selection
  const [sortedItems, setSortedItems] = useState(items)
  const [previousItems, setPreviousItems] = useState(items)
  const sortedItemsRef = useRef(sortedItems)

  if (items !== previousItems) {
    setPreviousItems(items)
    setSortedItems(items)
  }

  useEffect(() => {
    sortedItemsRef.current = sortedItems
  }, [sortedItems])

  return (
    <Flexbox className={styles.wrap}>
      <MenuBoardControls
        loadedItemCount={items.length}
        total={total}
        canReorder={canReorder}
        selection={selection}
      />

      <ScrollArea className={styles.scroll}>
        <Flexbox className={styles.list}>
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
        </Flexbox>

        <div ref={loadMoreSentinelRef} className={styles.sentinel}>
          {isFetchingNextPage && (
            <span className={styles.loadingMore}>Carregando mais itens…</span>
          )}
        </div>
      </ScrollArea>
    </Flexbox>
  )
}
