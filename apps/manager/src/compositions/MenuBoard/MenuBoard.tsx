import { Skeleton } from '@nino/ds'

import { useItemAvailability } from '@hooks/product/useItemAvailability'
import { useMenu } from '@hooks/product/useMenu'

import { MenuSection } from './MenuSection'
import type { MenuBoardProps } from './MenuBoard.types'

import styles from './MenuBoard.module.css'

export const MenuBoard = ({ tenantId }: MenuBoardProps) => {
  const { sections, isPending, isError } = useMenu(tenantId)
  const { mutate: setAvailability } = useItemAvailability(tenantId)

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
    <div className={styles.board}>
      {sections.map(({ id, name, items }, sectionIndex) => (
        <MenuSection
          key={id}
          tenantId={tenantId}
          name={name}
          items={items}
          sectionIndex={sectionIndex}
          onToggleAvailability={(itemId, isActive) =>
            setAvailability({ id: itemId, isActive })
          }
        />
      ))}
    </div>
  )
}
