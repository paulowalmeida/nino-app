import { BarList } from '@nino/ds/components/BarList'
import { Card } from '@nino/ds/components/Card'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { useSalesReport } from '@hooks/order/useSalesReport'
import { TOP_PRODUCTS_SKELETON_WIDTHS } from '@constants/order.constants'
import { brl } from '@utils/money'

import styles from './TopProducts.module.css'
import motion from '@styles/motion.module.css'

export type TopProductsProps = {
  tenantId: string | null
}

/** Five rows fit next to the chart without stretching the card. */
const LIMIT = 5

/**
 * What sold the most this week. The data was already coming in the sales
 * report and being discarded — the Overview page needed it without
 * knowing.
 *
 * Sorted by quantity, not revenue: the question here is what leaves the
 * kitchen, and an expensive item sold once isn't the flagship.
 */
export const TopProducts = ({ tenantId }: TopProductsProps) => {
  const { report, isPending } = useSalesReport(tenantId, { period: 'week' })

  const items = (report?.topProducts ?? []).slice(0, LIMIT).map((product) => ({
    id: product.productId,
    label: product.name,
    value: product.quantity,
    display: brl(product.revenue),
  }))

  return (
    <section aria-label="O que mais sai" className={styles.section}>
      <div className={motion.unroll}>
        <Eyebrow className={styles.heading}>O que mais sai</Eyebrow>
      </div>

      <Card padding="lg" className={`${motion.settle} ${styles.card}`}>
        {/* five bar rows, matching the ones that arrive — best seller on
            top */}
        {isPending && (
          <div className={styles.skeletonBars}>
            {TOP_PRODUCTS_SKELETON_WIDTHS.map((width) => (
              <Skeleton
                key={width}
                className={styles.skeletonBar}
                style={{ width }}
              />
            ))}
          </div>
        )}

        {!isPending && items.length === 0 && (
          <EmptyState className={styles.empty}>
            Nenhuma venda concluída na semana.
          </EmptyState>
        )}

        {!isPending && items.length > 0 && (
          <>
            <BarList items={items} className={styles.bars} />
            <p className={styles.note}>
              Barra por quantidade vendida; o valor é a receita do item.
            </p>
          </>
        )}
      </Card>
    </section>
  )
}
