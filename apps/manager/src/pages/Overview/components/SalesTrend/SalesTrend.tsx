import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { Tooltip } from '@nino/ds/components/Tooltip'
import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'
import { SalesChart } from '@shared/components/SalesChart/SalesChart'
import {
  SalesTrendSkeleton,
} from '@shared/skeletons/SalesTrendSkeleton/SalesTrendSkeleton'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './SalesTrend.module.css'

const PERCENT = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 0,
  signDisplay: 'exceptZero',
})

const deltaOf = (values: number[]): number | null => {
  if (values.length < 2) return null

  const previous = values[values.length - 2]
  if (previous === 0) return null

  return (values[values.length - 1] - previous) / previous
}

export const SalesTrend = () => {
  const { salesSeries } = useOverviewFacade()
  const { series, isPending } = salesSeries

  const points = series?.points ?? []
  const revenues = points.map(({ revenue }) => revenue)
  const total = revenues.reduce((sum, value) => sum + value, 0)
  const delta = deltaOf(revenues)
  const hasNoSales = !isPending && total === 0

  return (
    <Box
      as="section"
      id="faturamento-ultimos-7-dias"
      aria-label="Os últimos 7 dias"
      className={styles.section}
    >
      <Eyebrow className={styles.heading}>Os últimos 7 dias</Eyebrow>

      <Card variant="flat" padding="lg" className={`${motion.settle} ${styles.card}`}>
        <Box
          as="header"
          direction="row"
          gap={4}
          align="start"
          justify="between"
          mb={4}
        >
          <Box>
            {isPending ? (
              <Skeleton className={styles.skeletonTotal} />
            ) : (
              <Text as="p" className={styles.total}>{brl(total)}</Text>
            )}
            <Text className={styles.label}>faturamento na semana</Text>
          </Box>

          {delta !== null && (
            <Tooltip content="Variação do último dia sobre o anterior">
              <Text as='p' className={delta < 0 ? styles.deltaDown : styles.deltaUp}>
                {PERCENT.format(delta)}
                <Text as='span' className={styles.deltaNote}> vs. ontem</Text>
              </Text>
            </Tooltip>
          )}
        </Box>

        {isPending && <SalesTrendSkeleton />}

        {hasNoSales && (
          <EmptyState className={styles.empty}>
            Nenhuma venda concluída nos últimos sete dias.
          </EmptyState>
        )}

        {!isPending && !hasNoSales && series && (
          <SalesChart
            points={points}
            granularity={series.granularity}
            label="Faturamento por dia nos últimos sete dias"
          />
        )}
      </Card>
    </Box>
  )
}
