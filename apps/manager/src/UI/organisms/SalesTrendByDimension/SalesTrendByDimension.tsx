import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { SalesMultiChart } from '@organisms/SalesMultiChart/SalesMultiChart'
import type {
  SalesSeriesBreakdown,
} from '@custom_types/order/sales-series-breakdown'
import {
  SalesTrendSkeleton,
} from '@skeletons/organisms/SalesTrendSkeleton/SalesTrendSkeleton'

import styles from './SalesTrendByDimension.module.css'
import motion from '@styles/motion.module.css'

export type SalesTrendByDimensionProps = {
  title: string
  breakdown: SalesSeriesBreakdown | undefined
  isPending: boolean
  labelOf: (key: string) => string
  emptyMessage: string
}

export const SalesTrendByDimension = ({
  title,
  breakdown,
  isPending,
  labelOf,
  emptyMessage,
}: SalesTrendByDimensionProps) => {
  const series = breakdown?.series ?? []
  const hasNoSales =
    !isPending &&
    series.every((line) => line.points.every((point) => !point.revenue))

  return (
    <section className={`${motion.settle} ${styles.trendBlock}`}>
      <Heading level={2} size="lg" mb={3}>
        {title}
      </Heading>

      {isPending && <SalesTrendSkeleton />}

      {hasNoSales && (
        <EmptyState className={styles.empty}>{emptyMessage}</EmptyState>
      )}

      {!isPending && !hasNoSales && breakdown && (
        <SalesMultiChart
          series={series}
          granularity={breakdown.granularity}
          labelOf={labelOf}
          label={title}
        />
      )}
    </section>
  )
}
