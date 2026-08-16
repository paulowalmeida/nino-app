import { Flexbox } from '@nino/ds/components/Flexbox'
import { useEffect, useRef, useState } from 'react'

import { Reorder } from 'framer-motion'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { useCatalog } from '@hooks/product/useCatalog'
import { useItemAvailability } from '@hooks/product/useItemAvailability'
import { useLoadMore } from '@hooks/ui/useLoadMore'
import { useReorderMenuItems } from '@hooks/product/useReorderMenuItems'
import type { MenuItem } from '@custom_types/product/menu-item'
import {
  DeleteItemDialog,
} from '@organisms/DeleteItemDialog/DeleteItemDialog'
import {
  DeleteItemsDialog,
} from '@organisms/DeleteItemsDialog/DeleteItemsDialog'
import { MenuRow } from '@organisms/MenuRow/MenuRow'
import { MENU_BOARD_GHOST_ROWS } from '@constants/product.constants'

import styles from './MenuBoard.module.css'
import rowStyles from '@organisms/MenuRow/MenuRow.module.css'
import motion from '@styles/motion.module.css'

export type MenuBoardProps = {
  tenantId: string | null
  /** `null` is the whole menu; with a category chosen, dragging turns on. */
  categoryId: string | null
  search: string
}

export const MenuBoard = ({ tenantId, categoryId, search }: MenuBoardProps) => {
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

  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [idsPendingDelete, setIdsPendingDelete] = useState<string[]>([])

  const handleToggleSelect = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /** "All" means every item loaded so far — more loads in as the list is
   *  scrolled, same as the rows a person can currently see and check one
   *  by one. */
  const allLoadedSelected =
    items.length > 0 && selectedIds.size === items.length
  const someLoadedSelected = selectedIds.size > 0 && !allLoadedSelected

  const handleToggleSelectAll = () => {
    setSelectedIds(
      allLoadedSelected ? new Set() : new Set(items.map(({ id }) => id))
    )
  }

  const handleCancelSelection = () => {
    setIsSelecting(false)
    setSelectedIds(new Set())
  }

  const handleCloseDeleteItemsDialog = () => {
    setIdsPendingDelete([])
    handleCancelSelection()
  }

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
            <Flexbox as="ul" direction="column">
              {MENU_BOARD_GHOST_ROWS.map((row) => (
                <li key={row} className={rowStyles.item}>
                  <div className={rowStyles.itemLink}>
                    <Skeleton className={styles.ghostThumb} />
                    <div className={rowStyles.itemText}>
                      <Skeleton className={styles.ghostName} />
                      <Skeleton className={styles.ghostDescription} />
                    </div>
                    <Skeleton className={styles.ghostPrice} />
                  </div>
                  <Skeleton className={styles.ghostSwitch} />
                </li>
              ))}
            </Flexbox>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="error">
        Não foi possível carregar o cardápio. Recarregue a página para tentar de
        novo.
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
      <Flexbox
        direction="row"
        align="center"
        gap={2}
        shrink={false}
        className={styles.toolbar}
      >
        <div className={styles.toolbarLead}>
          {isSelecting ? (
            <Checkbox
              size="sm"
              checked={
                allLoadedSelected
                  ? true
                  : someLoadedSelected
                    ? 'indeterminate'
                    : false
              }
              onCheckedChange={handleToggleSelectAll}
              className={motion.press}
              aria-label={
                allLoadedSelected ? 'Desmarcar todos' : 'Selecionar todos'
              }
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={motion.press}
              aria-label="Selecionar itens"
              onClick={() => setIsSelecting(true)}
            >
              <Icon name="check-square" />
            </Button>
          )}
        </div>

        <p className={styles.tally}>
          {isSelecting
            ? selectedIds.size === 1
              ? '1 selecionado'
              : `${selectedIds.size} selecionados`
            : total === 1
              ? '1 item'
              : `${total} itens`}
          {canReorder &&
            !isSelecting &&
            ' · arraste para mudar a ordem no app do cliente'}
        </p>

        {isSelecting && (
          <Flexbox
            direction="row"
            align="center"
            gap={2}
            shrink={false}
            className={motion.unroll}
          >
            <Button
              variant="ghost"
              size="sm"
              className={motion.press}
              onClick={handleCancelSelection}
            >
              Cancelar
            </Button>

            {selectedIds.size > 0 && (
              <Button
                variant="danger"
                size="sm"
                className={`${motion.pop} ${motion.press}`}
                onClick={() => setIdsPendingDelete(Array.from(selectedIds))}
              >
                Excluir
              </Button>
            )}
          </Flexbox>
        )}
      </Flexbox>

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
                canReorder={canReorder && !isSelecting}
                isSelecting={isSelecting}
                isSelected={selectedIds.has(item.id)}
                onToggleSelect={handleToggleSelect}
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

      <DeleteItemDialog
        tenantId={tenantId}
        item={itemPendingDelete}
        onClose={() => setItemPendingDelete(null)}
      />

      <DeleteItemsDialog
        tenantId={tenantId}
        itemIds={idsPendingDelete}
        onClose={handleCloseDeleteItemsDialog}
      />
    </div>
  )
}
