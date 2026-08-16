import { EmptyState } from '@nino/ds/components/EmptyState'
import { SalesChart } from '@compositions/SalesChart/SalesChart'
import { useSalesSeries } from '@hooks/order/useSalesSeries'
import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import {
  SalesTrendSkeleton,
} from '@skeletons/compositions/SalesTrendSkeleton/SalesTrendSkeleton'

import styles from './SalesPeriodTrend.module.css'
import motion from '@styles/motion.module.css'

export type SalesPeriodTrendProps = {
  tenantId: string | null
  range: ReportRangeParams
}

export const SalesPeriodTrend = ({
  tenantId,
  range,
}: SalesPeriodTrendProps) => {
  const { series, isPending } = useSalesSeries(tenantId, range)

  const points = series?.points ?? []
  const hasNoSales = !isPending && points.every(({ revenue }) => !revenue)

  return (
    <section className={`${motion.settle} ${styles.block}`}>
      <h2 className={styles.blockTitle}>Faturamento no período</h2>

      {isPending && <SalesTrendSkeleton />}

      {hasNoSales && (
        <EmptyState className={styles.empty}>
          Nenhuma venda concluída no período.
        </EmptyState>
      )}

      {!isPending && !hasNoSales && series && (
        <SalesChart
          points={points}
          granularity={series.granularity}
          label="Faturamento por período no relatório"
        />
      )}
    </section>
  )
}
