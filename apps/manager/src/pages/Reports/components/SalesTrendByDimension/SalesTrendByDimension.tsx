import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import type { SalesSeriesBreakdown } from '@shared/types/order/sales-series-breakdown'

import { SalesMultiChart } from './SalesMultiChart/SalesMultiChart'

import motion from '@styles/motion.module.css'
import styles from './SalesTrendByDimension.module.css'

export type SalesTrendByDimensionProps = {
  title: string
  breakdown: SalesSeriesBreakdown
  labelOf: (key: string) => string
}

export const SalesTrendByDimension = ({
  title,
  breakdown,
  labelOf,
}: SalesTrendByDimensionProps) => (
  <Box as="section" className={`${motion.settle} ${styles.trendBlock}`}>
    <Heading level={2} size="lg" mb={3}>
      {title}
    </Heading>

    <SalesMultiChart
      series={breakdown.series}
      granularity={breakdown.granularity}
      labelOf={labelOf}
      label={title}
    />
  </Box>
)
