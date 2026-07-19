import { Skeleton, Switch } from '@nino/ds'

import { useItemAvailability } from '@hooks/product/useItemAvailability'
import { useMenu } from '@hooks/product/useMenu'

import type { MenuBoardProps } from './MenuBoard.types'

import styles from './MenuBoard.module.css'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const itemLabel = (total: number): string =>
  total === 1 ? '1 item' : `${total} itens`

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
      {sections.map(({ id, name, items }) => (
        <section key={id} className={styles.section}>
          <header className={styles.sectionHead}>
            <h2 className={styles.sectionName}>{name}</h2>
            <span className={styles.sectionCount}>
              {itemLabel(items.length)}
            </span>
          </header>

          <ul className={styles.items}>
            {items.map((item) => (
              <li
                key={item.id}
                className={item.isActive ? styles.item : styles.itemOff}
              >
                <div className={styles.itemText}>
                  <p className={styles.itemName}>{item.name}</p>
                  {item.description && (
                    <p className={styles.itemDescription}>{item.description}</p>
                  )}
                </div>

                <span className={styles.price}>{brl.format(+item.price)}</span>

                <Switch
                  size="sm"
                  checked={item.isActive}
                  onCheckedChange={(isActive) =>
                    setAvailability({ id: item.id, isActive })
                  }
                  aria-label={`${item.name} disponível`}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
