import { Card } from '@nino/ds/components/Card'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Eyebrow } from '@components/Eyebrow'
import { useSalesSeries } from '@hooks/order/useSalesSeries'
import { brl } from '@utils/money'

import { SalesChart } from '@compositions/SalesChart'

import type { SalesTrendProps } from './SalesTrend.types'

import styles from './SalesTrend.module.css'
import motion from '@styles/motion.module.css'

const PERCENT = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 0,
  signDisplay: 'exceptZero',
})

/**
 * Compara o último dia fechado com o anterior. Sem essa referência o número
 * sozinho não responde a pergunta que o dono faz — está bom ou está ruim?
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
            <p className={styles.total}>{isPending ? '—' : brl(total)}</p>
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

        {isPending && <Skeleton className={styles.skeleton} />}

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
