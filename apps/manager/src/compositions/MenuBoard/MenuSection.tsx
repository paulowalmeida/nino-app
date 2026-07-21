import { useEffect, useRef, useState } from 'react'

import { Reorder } from 'framer-motion'

import { useReorderMenuItems } from '@hooks/product/useReorderMenuItems'
import { riseDelay } from '@utils/rise-delay'

import { MenuRow } from './MenuRow'
import type { MenuSectionProps } from './MenuSection.types'

import styles from './MenuBoard.module.css'
import motion from '@styles/motion.module.css'

const itemLabel = (total: number): string =>
  total === 1 ? '1 item' : `${total} itens`

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
