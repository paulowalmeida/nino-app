import { type AnimationEvent, useState } from 'react'

import { Reorder, useDragControls } from 'framer-motion'

import { MenuRowContent } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowContent/MenuRowContent'
import { MenuRowLeadingControl } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowLeadingControl/MenuRowLeadingControl'
import { MenuRowTrailingActions } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowTrailingActions/MenuRowTrailingActions'
import { CATALOG_PAGE_SIZE } from '@pages/Catalog/constants/catalog.constants'
import { REORDER_TRANSITION } from '@shared/constants/reorder-transition.constants'
import type { MenuItem } from '@shared/types/product/menu-item'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRow.module.css'

const MAX_STAGGERED = 8

const entranceDelay = (index: number): number =>
  Math.min(index % CATALOG_PAGE_SIZE, MAX_STAGGERED) * 45 + 60

export type MenuRowProps = {
  item: MenuItem
  isImagePreloaded?: boolean
  index: number
  canReorder: boolean
  canManageCatalog?: boolean
  isSelecting: boolean
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onToggleAvailability: (id: string, isActive: boolean) => void
  onDelete: (item: MenuItem) => void
  onDragEnd: () => void
}

export const MenuRow = ({
  item,
  isImagePreloaded = false,
  index,
  canReorder,
  canManageCatalog = true,
  isSelecting,
  isSelected,
  onToggleSelect,
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
        item.isActive ? styles.menuRowItem : styles.itemOff
      }`}
      style={isEntering ? riseDelay(entranceDelay(index)) : {}}
    >
      <MenuRowLeadingControl
        itemName={item.name}
        canReorder={canReorder}
        isSelecting={isSelecting}
        isSelected={isSelected}
        dragControls={dragControls}
        onToggleSelect={() => onToggleSelect(item.id)}
      />

      <MenuRowContent item={item} isImagePreloaded={isImagePreloaded} />

      <MenuRowTrailingActions
        item={item}
        isSelecting={isSelecting}
        onToggleAvailability={(isActive) =>
          onToggleAvailability(item.id, isActive)
        }
        onDelete={() => onDelete(item)}
        canManageCatalog={canManageCatalog}
      />
    </Reorder.Item>
  )
}
