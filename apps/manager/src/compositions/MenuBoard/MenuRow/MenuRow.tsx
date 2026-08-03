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

import type { MenuRowProps } from './MenuRow.types'

import styles from '../MenuBoard.module.css'
import motion from '@styles/motion.module.css'

/*
 * A entrada é escalonada por lote e com teto. Com o índice global da lista, a
 * página 2 começava no item 21 — 945ms de espera — e como `deal` usa
 * `fill-mode: both`, a linha já ocupa o lugar dela enquanto espera: a lista
 * abria vinte faixas em branco que iam pintando ao longo de dois segundos.
 */
const MAX_STAGGERED = 8

const entranceDelay = (index: number): number =>
  Math.min(index % CATALOG_PAGE_SIZE, MAX_STAGGERED) * 45 + 60

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

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

      {/* só onde sobra largura: no celular, excluir mora na tela do item */}
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
