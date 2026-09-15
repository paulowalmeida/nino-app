import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { SalesChart } from '@shared/components/SalesChart/SalesChart'
import { useSalesSeries } from '@shared/hooks/order/useSalesSeries/useSalesSeries'
import {
  SalesTrendSkeleton,
} from '@shared/skeletons/SalesTrendSkeleton/SalesTrendSkeleton'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'

import motion from '@styles/motion.module.css'
import styles from './SalesPeriodTrend.module.css'

export type SalesPeriodTrendProps = {
  unitId: string | null
  range: ReportRangeParams
}

export const SalesPeriodTrend = ({
  unitId,
  range,
}: SalesPeriodTrendProps) => {
  const { series, isPending } = useSalesSeries(unitId, range)

  const points = series?.points ?? []
  const hasNoSales = !isPending && points.every(({ revenue }) => !revenue)

  return (
    <Box as="section" className={`${motion.settle} ${styles.block}`}>
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
    </Box>
  )
}
