import { BarList } from '@nino/ds/components/BarList'
import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { TOP_CUSTOMERS_SKELETON_WIDTHS } from '@pages/Overview/constants/overview.constants'

import motion from '@styles/motion.module.css'
import styles from './CustomerRankingCard.module.css'

type CustomerRankingCardProps = {
  label: string
  isPending: boolean
  items: { id: string; label: string; value: number; display: string }[]
}

export const CustomerRankingCard = ({
  label,
  isPending,
  items,
}: CustomerRankingCardProps) => (
  <Box as="section" aria-label={label} className={styles.section}>
    <Box className={motion.unroll}>
      <Eyebrow className={styles.heading}>{label}</Eyebrow>
    </Box>

    <Card variant="flat" padding="lg" className={`${motion.settle} ${styles.card}`}>
      {isPending && (
        <Box className={styles.skeletonBars}>
          {TOP_CUSTOMERS_SKELETON_WIDTHS.map((width) => (
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
          Nenhum cliente identificado ainda.
        </EmptyState>
      )}

      {!isPending && items.length > 0 && (
        <BarList
          items={items}
          highlightTop={3}
          className="text-brand"
        />
      )}
    </Card>
  </Box>
)
