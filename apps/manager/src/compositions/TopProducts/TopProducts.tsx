import { BarList } from '@nino/ds/components/BarList'
import { Card } from '@nino/ds/components/Card'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Eyebrow } from '@components/Eyebrow'
import { useSalesReport } from '@hooks/order/useSalesReport'
import { brl } from '@utils/money'

import type { TopProductsProps } from './TopProducts.types'

import styles from './TopProducts.module.css'
import motion from '@styles/motion.module.css'

/** Cinco linhas cabem ao lado do gráfico sem esticar o cartão. */
const LIMIT = 5

/**
 * O que mais saiu na semana. O dado já vinha no relatório de venda e era
 * descartado — a Visão geral pedia por ele sem saber.
 *
 * Ordena por quantidade, não por receita: a pergunta aqui é o que sai da
 * cozinha, e um item caro vendido uma vez não é o carro-chefe.
 */
export const TopProducts = ({ tenantId }: TopProductsProps) => {
  const { report, isPending } = useSalesReport(tenantId, { period: 'week' })

  const items = (report?.topProducts ?? []).slice(0, LIMIT).map((product) => ({
    id: product.productId,
    label: product.name,
    value: product.quantity,
    display: brl(product.revenue),
  }))

  return (
    <section aria-label="O que mais sai">
      <div className={motion.unroll}>
        <Eyebrow className={styles.heading}>O que mais sai</Eyebrow>
      </div>

      <Card className={`${motion.settle} ${styles.card}`}>
        {isPending && <Skeleton className={styles.skeleton} />}

        {!isPending && items.length === 0 && (
          <EmptyState>Nenhuma venda concluída na semana.</EmptyState>
        )}

        {!isPending && items.length > 0 && (
          <>
            <BarList items={items} className={styles.bars} />
            <p className={styles.note}>
              Barra por quantidade vendida; o valor é a receita do item.
            </p>
          </>
        )}
      </Card>
    </section>
  )
}
