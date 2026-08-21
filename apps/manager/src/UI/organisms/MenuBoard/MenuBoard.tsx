import { useEffect, useRef, useState, type RefCallback } from 'react'

import { Reorder } from 'framer-motion'

import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Icon } from '@nino/ds/components/Icon'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { MenuRow } from '@molecules/MenuRow/MenuRow'
import type { MenuItem } from '@custom_types/product/menu-item'

import styles from './MenuBoard.module.css'
import motion from '@styles/motion.module.css'

export type MenuBoardProps = {
  items: MenuItem[]
  total: number
  isFetchingNextPage: boolean
  isSelecting: boolean
  selectedIds: Set<string>
  canReorder: boolean
  loadMoreSentinelRef: RefCallback<HTMLDivElement>
  onStartSelection: () => void
  onToggleSelection: (id: string) => void
  onToggleAllSelection: () => void
  onCancelSelection: () => void
  onRequestDelete: (item: MenuItem) => void
  onRequestBulkDelete: () => void
  onAvailabilityChange: (id: string, isActive: boolean) => void
  onReorder: (items: MenuItem[]) => void
}

export const MenuBoard = ({
  items,
  total,
  isFetchingNextPage,
  isSelecting,
  selectedIds,
  canReorder,
  loadMoreSentinelRef,
  onStartSelection,
  onToggleSelection,
  onToggleAllSelection,
  onCancelSelection,
  onRequestDelete,
  onRequestBulkDelete,
  onAvailabilityChange,
  onReorder,
}: MenuBoardProps) => {
  const allLoadedSelected =
    items.length > 0 && selectedIds.size === items.length
  const someLoadedSelected = selectedIds.size > 0 && !allLoadedSelected
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
      <Flexbox
        direction="row"
        align="center"
        gap={2}
        shrink={false}
        className={styles.toolbar}
      >
        <Flexbox className={styles.toolbarLead}>
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
              onCheckedChange={onToggleAllSelection}
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
              onClick={onStartSelection}
            >
              <Icon name="check-square" />
            </Button>
          )}
        </Flexbox>

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
              onClick={onCancelSelection}
            >
              Cancelar
            </Button>

            {selectedIds.size > 0 && (
              <Button
                variant="danger"
                size="sm"
                className={`${motion.pop} ${motion.press}`}
                onClick={onRequestBulkDelete}
              >
                Excluir
              </Button>
            )}
          </Flexbox>
        )}
      </Flexbox>

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
