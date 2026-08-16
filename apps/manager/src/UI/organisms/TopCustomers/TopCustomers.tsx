import { TOP_CUSTOMERS_SKELETON_WIDTHS } from '@constants/customer.constants'
import { useTopCustomers } from '@hooks/customer/useTopCustomers'
import { BarList } from '@nino/ds/components/BarList'
import { Card } from '@nino/ds/components/Card'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { brl } from '@utils/money'

import styles from './TopCustomers.module.css'
import motion from '@styles/motion.module.css'

export type TopCustomersProps = {
  tenantId: string | null
}

/** Cinco nomes cabem no cartão sem esticar a tela. */
const LIMIT = 5

const EMPTY_MESSAGE = 'Nenhum cliente identificado ainda.'

const SkeletonBars = () => (
  <div className={styles.skeletonBars}>
    {TOP_CUSTOMERS_SKELETON_WIDTHS.map((width) => (
      <Skeleton key={width} className={styles.skeletonBar} style={{ width }} />
    ))}
  </div>
)

type RankingCardProps = {
  label: string
  isPending: boolean
  items: { id: string; label: string; value: number; display: string }[]
}

const RankingCard = ({ label, isPending, items }: RankingCardProps) => (
  <section aria-label={label} className={styles.section}>
    <div className={motion.unroll}>
      <Eyebrow className={styles.heading}>{label}</Eyebrow>
    </div>

    <Card padding="lg" className={`${motion.settle} ${styles.card}`}>
      {isPending && <SkeletonBars />}

      {!isPending && items.length === 0 && (
        <EmptyState className={styles.empty}>{EMPTY_MESSAGE}</EmptyState>
      )}

      {!isPending && items.length > 0 && (
        <BarList items={items} className="text-brand" />
      )}
    </Card>
  </section>
)

/** Quem mais compra na loja — por quanto gastou e por quantas vezes voltou. */
export const TopCustomers = ({ tenantId }: TopCustomersProps) => {
  const bySpent = useTopCustomers(tenantId, 'spent', LIMIT)
  const byOrders = useTopCustomers(tenantId, 'orders', LIMIT)

  const spentBars = bySpent.topCustomers.map((customer) => ({
    id: customer.id,
    label: customer.name,
    value: customer.spent,
    display: brl(customer.spent),
  }))

  const ordersBars = byOrders.topCustomers.map((customer) => ({
    id: customer.id,
    label: customer.name,
    value: customer.orders,
    display: String(customer.orders),
  }))

  return (
    <div className={styles.grid}>
      <RankingCard
        label="Quem mais gasta"
        isPending={bySpent.isPending}
        items={spentBars}
      />
      <RankingCard
        label="Quem mais pede"
        isPending={byOrders.isPending}
        items={ordersBars}
      />
    </div>
  )
}
