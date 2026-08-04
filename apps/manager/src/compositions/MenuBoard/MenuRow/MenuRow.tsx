import { useState, type AnimationEvent } from 'react'
import { Link } from 'react-router'

import { Reorder, useDragControls } from 'framer-motion'

import { Button } from '@nino/ds/components/Button'
import { Switch } from '@nino/ds/components/Switch'
import { Icon } from '@nino/ds/components/Icon'
import { ItemThumb } from '@components/ItemThumb/ItemThumb'
import { REORDER_TRANSITION } from '@constants/reorder-transition'
import { CATALOG_PAGE_SIZE } from '@hooks/product/useCatalog'
import { riseDelay } from '@utils/rise-delay'
import type { MenuItem } from '@custom_types/product'

import styles from '../MenuBoard.module.css'
import motion from '@styles/motion.module.css'

/*
 * The entrance is staggered per batch and with a cap. With the list's
 * global index, page 2 started at item 21 — a 945ms wait — and since
 * `deal` uses `fill-mode: both`, the row already occupies its spot while
 * waiting: the list opened twenty blank stripes that painted in over two
 * seconds.
 */
const MAX_STAGGERED = 8

const entranceDelay = (index: number): number =>
  Math.min(index % CATALOG_PAGE_SIZE, MAX_STAGGERED) * 45 + 60

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export type MenuRowProps = {
  item: MenuItem
  index: number
  /**
   * With no category chosen or with an active search, the drag handle
   * disappears.
   */
  canReorder: boolean
  onToggleAvailability: (id: string, isActive: boolean) => void
  /** Desktop only: on mobile deleting lives on the item's own screen. */
  onDelete: (item: MenuItem) => void
  onDragEnd: () => void
}

export const MenuRow = ({
  item,
  index,
  canReorder,
  onToggleAvailability,
  onDelete,
  onDragEnd,
}: MenuRowProps) => {
  const dragControls = useDragControls()
  const [isEntering, setIsEntering] = useState(true)

  const handleEntranceEnd = (event: AnimationEvent<HTMLLIElement>) => {
    if (event.target === event.currentTarget) setIsEntering(false)
  }

  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      onAnimationEnd={handleEntranceEnd}
      transition={REORDER_TRANSITION}
      className={`${isEntering ? motion.deal : ''} ${
        item.isActive ? styles.item : styles.itemOff
      }`}
      style={isEntering ? riseDelay(entranceDelay(index)) : {}}
    >
      {canReorder && (
        <button
          type="button"
          className={styles.dragHandle}
          aria-label={`Reordenar ${item.name}`}
          onPointerDown={(event) => dragControls.start(event)}
        >
          <Icon name="grip" />
        </button>
      )}

      <Link to={item.id} className={styles.itemLink}>
        <ItemThumb name={item.name} imageUrl={item.images?.[0]?.url} />
        <span className={styles.itemText}>
          <span className={styles.itemName}>{item.name}</span>
          {item.description && (
            <span className={styles.itemDescription}>{item.description}</span>
          )}
        </span>
        <span className={styles.price}>{brl.format(+item.price)}</span>
      </Link>

      <Switch
        size="sm"
        checked={item.isActive}
        onCheckedChange={(isActive) => onToggleAvailability(item.id, isActive)}
        aria-label={`${item.name} disponível`}
      />

      {/* only where width allows: on mobile, delete lives on the
        item's own screen */}
      <Button
        variant="ghost"
        size="icon"
        className={`${motion.press} ${styles.delete}`}
        aria-label={`Excluir ${item.name}`}
        onClick={() => onDelete(item)}
      >
        <Icon name="trash" />
      </Button>
    </Reorder.Item>
  )
}
