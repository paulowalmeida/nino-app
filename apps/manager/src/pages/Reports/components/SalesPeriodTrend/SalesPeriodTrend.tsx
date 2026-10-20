import { Box } from '@nino/ds/components/Box'
import { SalesChart } from '@shared/components/SalesChart/SalesChart'
import type { SalesSeries } from '@shared/types/order/sales-series'

import motion from '@styles/motion.module.css'
import styles from './SalesPeriodTrend.module.css'

export type SalesPeriodTrendProps = {
  series: SalesSeries
}

export const SalesPeriodTrend = ({ series }: SalesPeriodTrendProps) => (
  <Box as="section" className={`${motion.settle} ${styles.block}`}>
    <h2 className={styles.blockTitle}>Faturamento no período</h2>

    <SalesChart
      points={series.points}
      granularity={series.granularity}
      label="Faturamento por período no relatório"
    />
  </Box>
)
