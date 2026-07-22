import { useEffect, useRef, useState } from 'react'

import { Reorder } from 'framer-motion'

import { Skeleton } from '@nino/ds'

import { useItemAvailability } from '@hooks/product/useItemAvailability'
import { useMenu } from '@hooks/product/useMenu'
import { useReorderCategories } from '@hooks/product/useReorderCategories'

import { MenuSection } from './MenuSection'
import type { MenuBoardProps } from './MenuBoard.types'

import styles from './MenuBoard.module.css'

export const MenuBoard = ({ tenantId }: MenuBoardProps) => {
  const { sections, isPending, isError } = useMenu(tenantId)
  const { mutate: setAvailability } = useItemAvailability(tenantId)
  const { mutate: reorderCategories } = useReorderCategories(tenantId)

  const [order, setOrder] = useState(sections)
  const [prevSections, setPrevSections] = useState(sections)
  const orderRef = useRef(order)

  /** Re-seeds só quando a API manda um snapshot diferente do que já temos. */
  if (sections !== prevSections) {
    setPrevSections(sections)
    setOrder(sections)
  }

  useEffect(() => {
    orderRef.current = order
  }, [order])

  /**
   * Mesmo truque do MenuSection pra itens: as posições das categorias são
   * fixas (o mesmo conjunto, só reatribuído), então só reordena, não inventa
   * posição nova.
   */
  const persistSectionOrder = () => {
    const slots = sections.map((section) => section.position).sort((a, b) => a - b)
    const previousPositionById = new Map(
      sections.map((section) => [section.id, section.position])
    )
    const changes = orderRef.current
      .map((section, index) => ({ id: section.id, position: slots[index] }))
      .filter(({ id, position }) => previousPositionById.get(id) !== position)

    if (changes.length > 0) reorderCategories({ positions: changes })
  }

  if (isPending) {
    return (
      <div className={styles.loading}>
        <Skeleton className={styles.skeletonRow} />
        <Skeleton className={styles.skeletonRow} />
        <Skeleton className={styles.skeletonRow} />
      </div>
    )
  }

  if (isError) {
    return (
      <p className={styles.notice}>
        Não foi possível carregar o cardápio. Recarregue a página para tentar de
        novo.
      </p>
    )
  }

  if (sections.length === 0) {
    return (
      <p className={styles.notice}>
        Seu cardápio está vazio. Cadastre o primeiro item para começar a vender.
      </p>
    )
  }

  return (
    <Reorder.Group
      as="div"
      axis="y"
      values={order}
      onReorder={setOrder}
      className={styles.board}
    >
      {order.map((section, sectionIndex) => (
        <MenuSection
          key={section.id}
          value={section}
          tenantId={tenantId}
          name={section.name}
          items={section.items}
          sectionIndex={sectionIndex}
          onToggleAvailability={(itemId, isActive) =>
            setAvailability({ id: itemId, isActive })
          }
          onSectionDragEnd={persistSectionOrder}
        />
      ))}
    </Reorder.Group>
  )
}
