import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

import { Reorder, useDragControls } from 'framer-motion'

import { Switch } from '@nino/ds'

import { ItemThumb } from '@components/ItemThumb'
import type { MenuItem } from '@custom_types/product'
import { useReorderMenuItems } from '@hooks/product/useReorderMenuItems'
import { riseDelay } from '@utils/rise-delay'

import type { MenuSectionProps } from './MenuSection.types'

import styles from './MenuBoard.module.css'
import motion from '@styles/motion.module.css'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const itemLabel = (total: number): string =>
  total === 1 ? '1 item' : `${total} itens`

const GripIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <circle cx="9" cy="6" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="18" r="1" />
    <circle cx="15" cy="6" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="18" r="1" />
  </svg>
)

export const MenuSection = ({
  tenantId,
  name,
  items,
  sectionIndex,
  onToggleAvailability,
}: MenuSectionProps) => {
  const [order, setOrder] = useState(items)
  const [prevItems, setPrevItems] = useState(items)
  const orderRef = useRef(order)
  const { mutate: reorder } = useReorderMenuItems(tenantId)

  if (items !== prevItems) {
    setPrevItems(items)
    setOrder(items)
  }

  useEffect(() => {
    orderRef.current = order
  }, [order])

  /**
   * As posições dos itens da seção são fixas (o mesmo conjunto, só
   * reatribuído): a seção mantém o lugar dela na ordem global, só a ordem
   * interna muda.
   */
  const persist = () => {
    const slots = items.map((item) => item.position).sort((a, b) => a - b)
    const previousPositionById = new Map(
      items.map((item) => [item.id, item.position])
    )
    const changes = orderRef.current
      .map((item, index) => ({ id: item.id, position: slots[index] }))
      .filter(({ id, position }) => previousPositionById.get(id) !== position)

    if (changes.length > 0) reorder({ positions: changes })
  }

  return (
    <section className={styles.section}>
      <header
        className={`${motion.unroll} ${styles.sectionHead}`}
        style={riseDelay(sectionIndex * 90)}
      >
        <h2 className={styles.sectionName}>{name}</h2>
        <span className={styles.sectionCount}>{itemLabel(order.length)}</span>
      </header>

      <Reorder.Group
        as="ul"
        axis="y"
        values={order}
        onReorder={setOrder}
        className={styles.items}
      >
        {order.map((item, index) => (
          <MenuRow
            key={item.id}
            item={item}
            index={index}
            sectionIndex={sectionIndex}
            onToggleAvailability={onToggleAvailability}
            onDragEnd={persist}
          />
        ))}
      </Reorder.Group>
    </section>
  )
}

type MenuRowProps = {
  item: MenuItem
  index: number
  sectionIndex: number
  onToggleAvailability: (id: string, isActive: boolean) => void
  onDragEnd: () => void
}

const MenuRow = ({
  item,
  index,
  sectionIndex,
  onToggleAvailability,
  onDragEnd,
}: MenuRowProps) => {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      className={`${motion.deal} ${
        item.isActive ? styles.item : styles.itemOff
      }`}
      style={riseDelay(sectionIndex * 90 + index * 45 + 60)}
    >
      <button
        type="button"
        className={styles.dragHandle}
        aria-label={`Reordenar ${item.name}`}
        onPointerDown={(event) => dragControls.start(event)}
      >
        <GripIcon />
      </button>

      <Link to={item.id} className={`${motion.lift} ${styles.itemLink}`}>
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
    </Reorder.Item>
  )
}
