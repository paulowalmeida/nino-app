import { useState, type AnimationEvent } from 'react'
import { Link } from 'react-router'

import { Reorder, useDragControls, type Transition } from 'framer-motion'

import { Dialog } from '@nino/ds/components/Dialog'
import { Switch } from '@nino/ds/components/Switch'
import gripIcon from '@assets/icons/grip.svg?raw'
import trashIcon from '@assets/icons/trash.svg?raw'
import { Icon } from '@components/Icon/Icon'
import { ItemThumb } from '@components/ItemThumb'
import { useDeleteMenuItem } from '@hooks/product/useDeleteMenuItem'
import { riseDelay } from '@utils/rise-delay'

import type { MenuRowProps } from './MenuRow.types'

import styles from '../MenuBoard.module.css'
import motion from '@styles/motion.module.css'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const REORDER_TRANSITION: Transition = {
  duration: 0.32,
  ease: [0.16, 1, 0.3, 1],
}

export const MenuRow = ({
  item,
  index,
  sectionIndex,
  tenantId,
  onToggleAvailability,
  onDragEnd,
}: MenuRowProps) => {
  const dragControls = useDragControls()
  const [isEntering, setIsEntering] = useState(true)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { mutate: deleteItem, isPending: isDeleting } = useDeleteMenuItem(
    tenantId,
    item.id
  )

  const handleEntranceEnd = (event: AnimationEvent<HTMLLIElement>) => {
    if (event.target === event.currentTarget) setIsEntering(false)
  }

  const handleDelete = () => {
    deleteItem(undefined, { onSuccess: () => setIsDeleteOpen(false) })
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
      style={isEntering ? riseDelay(sectionIndex * 90 + index * 45 + 60) : {}}
    >
      <button
        type="button"
        className={styles.dragHandle}
        aria-label={`Reordenar ${item.name}`}
        onPointerDown={(event) => dragControls.start(event)}
      >
        <Icon svg={gripIcon} />
      </button>

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

      <button
        type="button"
        className={styles.deleteHandle}
        aria-label={`Excluir ${item.name}`}
        onClick={() => setIsDeleteOpen(true)}
      >
        <Icon svg={trashIcon} />
      </button>

      <Dialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Excluir item"
        description={`"${item.name}" será removido do cardápio. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        loading={isDeleting}
      />
    </Reorder.Item>
  )
}
