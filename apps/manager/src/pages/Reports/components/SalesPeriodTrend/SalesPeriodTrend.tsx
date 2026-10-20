import { Box } from '@nino/ds/components/Box'
import { SalesChart } from '@shared/components/SalesChart/SalesChart'
import type { SalesSeries } from '@shared/types/order/sales-series'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './SalesPeriodTrend.module.css'

export type SalesPeriodTrendProps = {
  series: SalesSeries
  delay?: number
}

export const SalesPeriodTrend = ({ series, delay = 0 }: SalesPeriodTrendProps) => (
  <Box
    as="section"
    className={`${motion.deal} ${styles.block}`}
    style={riseDelay(delay)}
  >
    <h2 className={styles.blockTitle}>Faturamento no período</h2>

    <SalesChart
      points={series.points}
      granularity={series.granularity}
      label="Faturamento por período no relatório"
    />
  </Box>
)
