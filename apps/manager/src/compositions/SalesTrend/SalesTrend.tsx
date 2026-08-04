import { Card } from '@nino/ds/components/Card'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { useSalesSeries } from '@hooks/order/useSalesSeries'
import { brl } from '@utils/money'

import { SalesChart } from '@compositions/SalesChart/SalesChart'

import styles from './SalesTrend.module.css'
import motion from '@styles/motion.module.css'

export type SalesTrendProps = {
  tenantId: string | null
}

const PERCENT = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 0,
  signDisplay: 'exceptZero',
})

/** Seven days at the chart's base — the same slice the series brings. */
const SKELETON_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

/**
 * Compares the last closed day against the previous one. Without this
 * reference the number alone doesn't answer the question the owner asks —
 * is it good or bad?
 */
const deltaOf = (values: number[]): number | null => {
  if (values.length < 2) return null

  const previous = values[values.length - 2]
  if (previous === 0) return null

  return (values[values.length - 1] - previous) / previous
}

export const SalesTrend = ({ tenantId }: SalesTrendProps) => {
  const { series, isPending } = useSalesSeries(tenantId, { period: 'week' })

  const points = series?.points ?? []
  const revenues = points.map(({ revenue }) => revenue)
  const total = revenues.reduce((sum, value) => sum + value, 0)
  const delta = deltaOf(revenues)
  const noSales = !isPending && total === 0

  return (
    <section aria-label="Os últimos 7 dias" className={styles.section}>
      <div className={motion.unroll}>
        <Eyebrow className={styles.heading}>
          Os últimos 7 dias
        </Eyebrow>
      </div>

      <Card className={`${motion.settle} ${styles.card}`}>
        <header className={styles.head}>
          <div>
            {isPending ? (
              <Skeleton className={styles.skeletonTotal} />
            ) : (
              <p className={styles.total}>{brl(total)}</p>
            )}
            <p className={styles.label}>faturamento na semana</p>
          </div>

          {delta !== null && (
            <p
              className={delta < 0 ? styles.deltaDown : styles.deltaUp}
              title="Variação do último dia sobre o anterior"
            >
              {PERCENT.format(delta)}
              <span className={styles.deltaNote}> vs. ontem</span>
            </p>
          )}
        </header>

        {/* the chart shape to come: axis on the left, seven days at the base */}
        {isPending && (
          <div className={styles.skeletonChart}>
            <div className={styles.skeletonAxis}>
              <Skeleton className={styles.skeletonTick} />
              <Skeleton className={styles.skeletonTick} />
              <Skeleton className={styles.skeletonTick} />
              <Skeleton className={styles.skeletonTick} />
            </div>
            <div className={styles.skeletonPlot}>
              <Skeleton className={styles.skeletonLine} />
              <div className={styles.skeletonDays}>
                {SKELETON_DAYS.map((day) => (
                  <Skeleton key={day} className={styles.skeletonDay} />
                ))}
              </div>
            </div>
          </div>
        )}

        {noSales && (
          <EmptyState>
            Nenhuma venda concluída nos últimos sete dias.
          </EmptyState>
        )}

        {!isPending && !noSales && series && (
          <SalesChart
            points={points}
            granularity={series.granularity}
            label="Faturamento por dia nos últimos sete dias"
          />
        )}
      </Card>
    </section>
  )
}
