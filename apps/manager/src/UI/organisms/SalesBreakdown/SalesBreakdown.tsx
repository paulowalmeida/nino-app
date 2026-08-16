import { BarList } from '@nino/ds/components/BarList'
import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from './SalesBreakdown.module.css'
import motion from '@styles/motion.module.css'

type SalesBreakdownItem = {
  id: string
  label: string
  value: number
  display: string
}

export type SalesBreakdownProps = {
  title: string
  items: SalesBreakdownItem[]
  isPending: boolean
  emptyMessage: string
}

/**
 * Faturamento repartido por uma dimensão do pedido — canal, forma de
 * pagamento, o que vier. Uma `BarList` só, de propósito: o relatório já é
 * denso, e uma segunda visualização por bloco (barra + pizza, por exemplo)
 * competiria por atenção sem acrescentar leitura nova ao mesmo dado.
 */
export const SalesBreakdown = ({
  title,
  items,
  isPending,
  emptyMessage,
}: SalesBreakdownProps) => (
  <section className={`${motion.settle} ${styles.block}`}>
    <h2 className={styles.blockTitle}>{title}</h2>

    {isPending && (
      <div className={styles.skeletonRows}>
        <Skeleton className={styles.skeletonBar} />
        <Skeleton className={styles.skeletonBarShort} />
        <Skeleton className={styles.skeletonBarShort} />
      </div>
    )}

    {!isPending && items.length === 0 && (
      <p className={styles.empty}>{emptyMessage}</p>
    )}

    {!isPending && items.length > 0 && (
      <BarList items={items} className="text-brand" />
    )}
  </section>
)
