import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import type { SalesSeriesBreakdown } from '@shared/types/order/sales-series-breakdown'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import { SalesMultiChart } from './SalesMultiChart/SalesMultiChart'

import motion from '@styles/motion.module.css'
import styles from './SalesTrendByDimension.module.css'

export type SalesTrendByDimensionProps = {
  title: string
  breakdown: SalesSeriesBreakdown
  labelOf: (key: string) => string
  delay?: number
}

export const SalesTrendByDimension = ({
  title,
  breakdown,
  labelOf,
  delay = 0,
}: SalesTrendByDimensionProps) => (
  <Box
    as="section"
    className={`${motion.deal} ${styles.trendBlock}`}
    style={riseDelay(delay)}
  >
    <Header level={2} size="lg" mb={3} title={title} />

    <SalesMultiChart
      series={breakdown.series}
      granularity={breakdown.granularity}
      labelOf={labelOf}
      label={title}
    />
  </Box>
)
