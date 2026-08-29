import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from '@shared/components/KitchenCard/KitchenCard.module.css'

const GHOST_ITEMS = ['first', 'second']

export const KitchenCardSkeleton = () => (
  <article className={`${styles.card} ${styles.paperPlain}`}>
    <Box as="header" className={styles.head}>
      <Skeleton className={styles.ghostNumber} />
      <Skeleton className={styles.ghostClock} />
    </Box>

    <Box className={styles.who}>
      <Skeleton className={styles.ghostDestination} />
      <Skeleton className={styles.ghostName} />
    </Box>

    <Box className={styles.ruler} aria-hidden="true" />

    <Box className={styles.items}>
      {GHOST_ITEMS.map((item) => (
        <Box key={item} className={styles.item}>
          <Skeleton className={styles.ghostQuantity} />
          <Skeleton className={styles.ghostItemName} />
        </Box>
      ))}
    </Box>

    <Skeleton className={styles.ghostAction} />
  </article>
)
