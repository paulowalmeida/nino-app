import { useEffect, useRef, useState } from 'react'

import { Reorder } from 'framer-motion'

import { Alert } from '@nino/ds/components/Alert'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { useCatalog } from '@hooks/product/useCatalog'
import { useItemAvailability } from '@hooks/product/useItemAvailability'
import { useLoadMore } from '@hooks/ui/useLoadMore'
import { useReorderMenuItems } from '@hooks/product/useReorderMenuItems'
import type { MenuItem } from '@custom_types/product'

import { DeleteItemDialog } from './DeleteItemDialog/DeleteItemDialog'
import { MenuRow } from './MenuRow/MenuRow'

import styles from './MenuBoard.module.css'
import motion from '@styles/motion.module.css'

/** Six rows: what fits on the first screen before scrolling is needed. */
const GHOST_ROWS = ['one', 'two', 'three', 'four', 'five', 'six']

export type MenuBoardProps = {
  tenantId: string | null
  /** `null` is the whole menu; with a category chosen, dragging turns on. */
  categoryId: string | null
  search: string
}

export const MenuBoard = ({
  tenantId,
  categoryId,
  search,
}: MenuBoardProps) => {
  const {
    items,
    total,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCatalog(tenantId, { categoryId, search })

  const { mutate: setAvailability } = useItemAvailability(tenantId)
  const [itemPendingDelete, setItemPendingDelete] = useState<MenuItem | null>(
    null
  )
  const { mutate: reorder } = useReorderMenuItems(tenantId, categoryId)
  const sentinelRef = useLoadMore(!!hasNextPage, () => void fetchNextPage())

  /**
   * Dragging only makes sense within a category: an item's position is
   * relative to its siblings. In "All" the list spans categories, and in a
   * search it's a slice — moving the third row of a result doesn't say
   * where the item should go in the menu.
   */
  const canReorder = !!categoryId && !search

  const [sortedItems, setSortedItems] = useState(items)
  const [prevItems, setPrevItems] = useState(items)
  const sortedItemsRef = useRef(sortedItems)

  /** Re-seeds only when the API sends a different slice than what we have. */
  if (items !== prevItems) {
    setPrevItems(items)
    setSortedItems(items)
  }

  useEffect(() => {
    sortedItemsRef.current = sortedItems
  }, [sortedItems])

  /**
   * Positions are fixed (the same set, just reassigned): the list loads the
   * category in order, so swapping two rows swaps two positions that
   * already exist — it never invents a new position or shifts what hasn't
   * loaded yet.
   */
  const persist = () => {
    const slots = items.map((item) => item.position).sort((a, b) => a - b)
    const previousPositionById = new Map(
      items.map((item) => [item.id, item.position])
    )
    const changes = sortedItemsRef.current
      .map((item, index) => ({ id: item.id, position: slots[index] }))
      .filter(({ id, position }) => previousPositionById.get(id) !== position)

    if (changes.length > 0) reorder({ positions: changes })
  }

  /*
   * The skeleton reuses the real list's classes — same card, same
   * dividers, same row height. Three loose blocks with spacing between
   * them, like before, had their own geometry and the list jumped on
   * arrival.
   */
  if (isPending) {
    return (
      <div className={styles.wrap}>
        <Skeleton className={styles.ghostTally} />

        <div className={styles.scroll}>
          <div className={styles.list}>
            <ul className={styles.items}>
              {GHOST_ROWS.map((row) => (
                <li key={row} className={styles.item}>
                  <div className={styles.itemLink}>
                    <Skeleton className={styles.ghostThumb} />
                    <div className={styles.itemText}>
                      <Skeleton className={styles.ghostName} />
                      <Skeleton className={styles.ghostDescription} />
                    </div>
                    <Skeleton className={styles.ghostPrice} />
                  </div>
                  <Skeleton className={styles.ghostSwitch} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="error">
        Não foi possível carregar o cardápio. Recarregue a página para
        tentar de novo.
      </Alert>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState size="md" className={motion.unroll}>
        {search
          ? `Nenhum item com "${search}". Tente outro nome.`
          : 'Nada nesta categoria ainda. Cadastre o primeiro item.'}
      </EmptyState>
    )
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.tally}>
        {total === 1 ? '1 item' : `${total} itens`}
        {canReorder && ' · arraste para mudar a ordem no app do cliente'}
      </p>

      {/* scrolling starts here: the count above stays put */}
      <ScrollArea className={styles.scroll}>
        <div className={styles.list}>
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
                canReorder={canReorder}
                onToggleAvailability={(itemId, isActive) =>
                  setAvailability({ id: itemId, isActive })
                }
                onDelete={setItemPendingDelete}
                onDragEnd={persist}
              />
            ))}
          </Reorder.Group>
        </div>

        {/* sentinel: enters view and pulls the next page on its own */}
        <div ref={sentinelRef} className={styles.sentinel}>
          {isFetchingNextPage && (
            <span className={styles.loadingMore}>Carregando mais itens…</span>
          )}
        </div>
      </ScrollArea>

      {itemPendingDelete && (
        <DeleteItemDialog
          tenantId={tenantId}
          item={itemPendingDelete}
          onClose={() => setItemPendingDelete(null)}
        />
      )}
    </div>
  )
}
