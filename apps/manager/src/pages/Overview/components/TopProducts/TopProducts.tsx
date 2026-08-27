import { BarList } from '@nino/ds/components/BarList'
import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  TOP_PRODUCTS_SKELETON_WIDTHS,
} from '@pages/Overview/constants/overview.constants'
import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './TopProducts.module.css'

const LIMIT = 5

export const TopProducts = () => {
  const { salesReport } = useOverviewFacade()
  const { report, isPending } = salesReport

  const items = (report?.topProducts ?? []).slice(0, LIMIT).map((product) => ({
    id: product.productId,
    label: product.name,
    value: product.quantity,
    display: `${product.quantity} un · ${brl(product.revenue)}`,
  }))

  return (
    <Box as="section" aria-label="O que mais sai" className={styles.section}>
      <Box className={motion.unroll}>
        <Eyebrow className={styles.heading}>O que mais sai</Eyebrow>
      </Box>

      <Card padding="lg" className={`${motion.settle} ${styles.card}`}>
        {isPending && (
          <Box className={styles.skeletonBars}>
            {TOP_PRODUCTS_SKELETON_WIDTHS.map((width) => (
              <Skeleton
                key={width}
                className={styles.skeletonBar}
                style={{ width }}
              />
            ))}
          </Box>
        )}

        {!isPending && items.length === 0 && (
          <EmptyState className={styles.empty}>
            Nenhuma venda concluída na semana.
          </EmptyState>
        )}

        {!isPending && items.length > 0 && (
          <BarList items={items} highlightTop={3} className={styles.bars} />
        )}
      </Card>
    </Box>
  )
}
